import {
  getToken, getRefreshToken, saveSession, clearSession, redirectToLogin, sessionExpired,
} from './auth'

const BASE = process.env.NEXT_PUBLIC_API_URL || ''

// Errors carry the HTTP status and the backend's `code` so callers can tell
// "you are signed out" apart from "that request was malformed" or "the server
// is having a moment". Pages used to guess by substring-matching the message,
// which is how a 400 ended up logging people out.
export class ApiError extends Error {
  constructor(message, status, code) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
  get isAuthError() {
    return this.status === 401
  }
}

// Supabase access tokens expire after 1 hour by design — that is normal and
// not a bug. What WAS a bug: every page treated "1 hour passed" as "you are
// logged out" and bounced to /auth. Refreshing through our own backend (rather
// than the browser calling Supabase directly) is what lets the 7-day session
// cap apply to refreshes as well as to API calls.
//
// Single-flight: the dashboard fires three requests in parallel, and three
// simultaneous refreshes would rotate the refresh token out from under each
// other and sign the user out for real.
let refreshInFlight = null

async function refreshSession() {
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return null

    try {
      const res = await fetch(`${BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })
      if (!res.ok) return null

      const data = await res.json()
      if (!data?.session?.access_token) return null

      // saveSession deliberately does not extend the 7-day deadline.
      saveSession(data.session, data.user, data.session_max_age_days)
      return data.session.access_token
    } catch {
      // Network failure is not proof of a dead session — returning null just
      // means "could not refresh right now".
      return null
    } finally {
      refreshInFlight = null
    }
  })()

  return refreshInFlight
}

function signOutAndRedirect() {
  clearSession()
  redirectToLogin()
}

async function apiFetch(path, options = {}, token = null, _retried = false) {
  // The 7 days are up — don't bother the server, and don't let a stale token
  // make the UI look signed in.
  if (token && sessionExpired()) {
    signOutAndRedirect()
    throw new ApiError('Your session has expired. Please sign in again.', 401, 'SESSION_EXPIRED')
  }

  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers['Authorization'] = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${BASE}${path}`, { ...options, headers })
  } catch {
    // A dead network / sleeping backend is NOT a logged-out user.
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0, 'NETWORK')
  }

  const data = await res.json().catch(() => ({}))

  if (res.ok) return data

  const code = data.code || null

  if (res.status === 401 && token) {
    // SESSION_EXPIRED is terminal — the backend has revoked the refresh token,
    // so retrying the refresh would only fail again.
    if (code === 'SESSION_EXPIRED') {
      signOutAndRedirect()
      throw new ApiError(data.error || 'Your session has expired. Please sign in again.', 401, code)
    }

    if (!_retried) {
      const newToken = await refreshSession()
      if (newToken) return apiFetch(path, options, newToken, true)
    }

    // The refresh token itself is gone or revoked. THIS is the one moment
    // where signing the person out is actually the right answer.
    signOutAndRedirect()
    throw new ApiError(data.error || 'Your session has expired. Please sign in again.', 401, code || 'TOKEN_INVALID')
  }

  throw new ApiError(data.error || `Request failed (${res.status})`, res.status, code)
}

// Convenience wrapper for calls that need the current session. Reads the token
// itself so callers cannot accidentally forget to pass it — which is exactly
// what made deleteSite() 401 every time.
function authed(path, options = {}) {
  const token = getToken()
  if (!token) {
    redirectToLogin()
    return Promise.reject(new ApiError('Please sign in to continue.', 401, 'NO_TOKEN'))
  }
  return apiFetch(path, options, token)
}

export const api = {
  getTemplates: () => apiFetch('/api/templates'),
  getTemplate: (slug) => apiFetch(`/api/templates/${encodeURIComponent(slug)}`),
  // ── auth ──────────────────────────────────────────────────────────────────
  signup: (email, password) =>
    apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) }),
  login: (email, password) =>
    apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => authed('/api/auth/logout', { method: 'POST' }),
  me: (t) => apiFetch('/api/auth/me', {}, t || getToken()),
  updateProfile: (name, t) =>
    apiFetch('/api/auth/me', { method: 'PATCH', body: JSON.stringify({ name }) }, t || getToken()),

  oauthUrl: (provider) => apiFetch(`/api/auth/oauth-url?provider=${provider}`),
  // `state` pairs this callback with the PKCE verifier the backend stored when
  // it built the OAuth URL. Omitting it (as this used to) forced the backend
  // onto its shared-client fallback, which breaks when two people sign in at
  // the same moment.
  oauthCallback: (code, state) =>
    apiFetch('/api/auth/oauth-callback', { method: 'POST', body: JSON.stringify({ code, state }) }),

  // ── sites ─────────────────────────────────────────────────────────────────
  getSites: (t) => apiFetch('/api/sites', {}, t || getToken()),
  connectSite: (url, tok, t) =>
    apiFetch('/api/sites/connect', { method: 'POST', body: JSON.stringify({ site_url: url, site_token: tok }) }, t || getToken()),
  starSite: (id, starred, t) =>
    apiFetch(`/api/sites/${id}/star`, { method: 'PATCH', body: JSON.stringify({ starred }) }, t || getToken()),
  // Was missing its token argument entirely, so every delete came back 401.
  deleteSite: (id, t) =>
    apiFetch(`/api/sites/${id}`, { method: 'DELETE' }, t || getToken()),
  getSiteContext: (id, t) => apiFetch(`/api/sites/${id}/context`, {}, t || getToken()),

  // Provider-neutral WordPress connector (OpenAI and Claude share these APIs).
  getConnectorCapabilities: (t) => apiFetch('/api/sites/connector/capabilities', {}, t || getToken()),
  inspectSite: (id, t) => apiFetch(`/api/sites/${encodeURIComponent(id)}/inspect`, {}, t || getToken()),
  executeConnectorAction: (id, action, t) =>
    apiFetch(`/api/sites/${encodeURIComponent(id)}/connector-action`, {
      method: 'POST', body: JSON.stringify({ confirm: true, action }),
    }, t || getToken()),

  // ── chat ──────────────────────────────────────────────────────────────────
  // session_id keeps a conversation in ONE sidebar thread. Without it the
  // backend started a brand-new session on every single message.
  sendMessage: (siteId, msg, history, t, sessionId = null, image = null) =>
    apiFetch('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({ site_id: siteId, message: msg, history, session_id: sessionId, ...(image ? { image } : {}) }),
    }, t || getToken()),
  getSessions: (siteId, t) => apiFetch(`/api/chat/sessions?site_id=${siteId}`, {}, t || getToken()),
  // The backend wants session_id; this used to send site_id and get a 400 back,
  // which the chat page then reported as "please log in".
  getHistory: (siteId, t, sessionId = null) =>
    apiFetch(
      sessionId
        ? `/api/chat/history?session_id=${sessionId}`
        : `/api/chat/history?site_id=${siteId}`,
      {}, t || getToken(),
    ),

  // ── credits & billing ─────────────────────────────────────────────────────
  getCredits: (t) => apiFetch('/api/credits', {}, t || getToken()),
  getPlans: () => apiFetch('/api/credits/plans'),
  billingPortal: (t) => apiFetch('/api/billing/portal', { method: 'POST' }, t || getToken()),
  checkout: (planId, cycle, t) =>
    apiFetch('/api/billing/checkout', { method: 'POST', body: JSON.stringify({ plan_id: planId, billing_cycle: cycle }) }, t || getToken()),
}
