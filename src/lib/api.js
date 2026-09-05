const BASE = process.env.NEXT_PUBLIC_API_URL || ''
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Supabase access tokens expire after 1 hour by design — that's normal and
// not a bug. What WAS a bug: this app only ever stored the access token and
// threw away the refresh token, so every page treated "1 hour passed" as
// "you're logged out" and bounced to /auth. Refresh tokens last far longer
// (weeks, until actually revoked), so a silent refresh here is what makes a
// session actually last as long as it should.
async function refreshSession() {
  const refreshToken = localStorage.getItem('aiwpb_refresh_token')
  if (!refreshToken || !SUPABASE_URL || !SUPABASE_ANON_KEY) return null
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data.access_token) return null
    localStorage.setItem('aiwpb_token', data.access_token)
    if (data.refresh_token) localStorage.setItem('aiwpb_refresh_token', data.refresh_token)
    return data.access_token
  } catch {
    return null
  }
}

async function apiFetch(path, options = {}, token = null, _retried = false) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  if (res.status === 401 && token && !_retried) {
    const newToken = await refreshSession()
    if (newToken) return apiFetch(path, options, newToken, true)
    // Refresh genuinely failed (refresh token itself expired/revoked) —
    // THIS is when it's actually correct to sign the person out.
    localStorage.removeItem('aiwpb_token')
    localStorage.removeItem('aiwpb_refresh_token')
    localStorage.removeItem('aiwpb_user')
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const api = {
  signup:      (e, p)           => apiFetch('/api/auth/signup',  { method:'POST', body:JSON.stringify({email:e,password:p}) }),
  login:       (e, p)           => apiFetch('/api/auth/login',   { method:'POST', body:JSON.stringify({email:e,password:p}) }),
  me:          (t)              => apiFetch('/api/auth/me', {}, t),
  updateProfile: (name, t)      => apiFetch('/api/auth/me', { method:'PATCH', body:JSON.stringify({name}) }, t),
  oauthUrl:    (provider)       => apiFetch(`/api/auth/oauth-url?provider=${provider}`),
  getSites:    (t)              => apiFetch('/api/sites', {}, t),
  connectSite: (url, tok, t)    => apiFetch('/api/sites/connect', { method:'POST', body:JSON.stringify({site_url:url,site_token:tok}) }, t),
  starSite:    (id, starred, t) => apiFetch(`/api/sites/${id}/star`, { method:'PATCH', body:JSON.stringify({starred}) }, t),
  deleteSite:  (id, t)          => apiFetch(`/api/sites/${id}`, { method:'DELETE' }, t),
  sendMessage: (siteId, msg, history, t) =>
    apiFetch('/api/chat/message', { method:'POST', body:JSON.stringify({site_id:siteId,message:msg,history}) }, t),
  getHistory:  (siteId, t)      => apiFetch(`/api/chat/history?site_id=${siteId}`, {}, t),
  getCredits:  (t)              => apiFetch('/api/credits', {}, t),
  getPlans:    ()               => apiFetch('/api/credits/plans'),
  billingPortal: (t)            => apiFetch('/api/billing/portal', { method:'POST' }, t),
  checkout:    (planId, cycle, t) => apiFetch('/api/billing/checkout', { method:'POST', body:JSON.stringify({plan_id:planId, billing_cycle:cycle}) }, t),
  oauthCallback: (code) => apiFetch('/api/auth/oauth-callback', { method:'POST', body:JSON.stringify({code}) }),
}
