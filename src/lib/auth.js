// ─────────────────────────────────────────────────────────────────────────────
// One place that owns the session. Every page used to poke at localStorage
// directly with slightly different rules — dashboard checked for the string
// "401" inside an error message, chat treated ANY failure as logged-out — so
// a plain network hiccup or a 400 from a mismatched query param looked exactly
// like a sign-out. Routing all of it through here is what makes "am I signed
// in?" have a single answer.
// ─────────────────────────────────────────────────────────────────────────────

export const TOKEN_KEY    = 'aiwpb_token'
export const REFRESH_KEY  = 'aiwpb_refresh_token'
export const USER_KEY     = 'aiwpb_user'
export const EXPIRES_KEY  = 'aiwpb_session_expires_at'

// Mirrors SESSION_MAX_AGE_DAYS in the backend's src/middleware/auth.js. The
// backend is the enforcer; this copy only lets the UI stop pretending to be
// signed in before it makes a request it knows will fail.
export const SESSION_MAX_AGE_DAYS = 7

function safeGet(key) {
  if (typeof window === 'undefined') return null
  try { return window.localStorage.getItem(key) } catch { return null }
}

function safeSet(key, value) {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(key, value) } catch {}
}

function safeRemove(key) {
  if (typeof window === 'undefined') return
  try { window.localStorage.removeItem(key) } catch {}
}

// Called after signup / login / OAuth / refresh. `maxAgeDays` comes from the
// server response so the two never drift apart.
export function saveSession(session, user, maxAgeDays = SESSION_MAX_AGE_DAYS) {
  if (!session?.access_token) return

  safeSet(TOKEN_KEY, session.access_token)
  if (session.refresh_token) safeSet(REFRESH_KEY, session.refresh_token)
  if (user) safeSet(USER_KEY, JSON.stringify(user))

  // Only stamp an expiry on a fresh sign-in. A refresh must NOT push the
  // deadline out, or an open tab renews itself forever and the 7 days never
  // arrive — which is the whole point of the cap.
  if (!safeGet(EXPIRES_KEY)) {
    const ms = (maxAgeDays || SESSION_MAX_AGE_DAYS) * 24 * 60 * 60 * 1000
    safeSet(EXPIRES_KEY, String(Date.now() + ms))
  }
}

export function startNewSession(session, user, maxAgeDays = SESSION_MAX_AGE_DAYS) {
  clearSession()
  const ms = (maxAgeDays || SESSION_MAX_AGE_DAYS) * 24 * 60 * 60 * 1000
  safeSet(EXPIRES_KEY, String(Date.now() + ms))
  saveSession(session, user, maxAgeDays)
}

export function getRefreshToken() {
  return safeGet(REFRESH_KEY)
}

export function getUser() {
  const raw = safeGet(USER_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function sessionExpired() {
  const at = Number(safeGet(EXPIRES_KEY))
  if (!at) return false            // pre-existing session with no stamp: let the server decide
  return Date.now() > at
}

// The token, or null if there isn't one / the 7 days are up.
export function getToken() {
  const token = safeGet(TOKEN_KEY)
  if (!token) return null
  if (sessionExpired()) { clearSession(); return null }
  return token
}

export function clearSession() {
  safeRemove(TOKEN_KEY)
  safeRemove(REFRESH_KEY)
  safeRemove(USER_KEY)
  safeRemove(EXPIRES_KEY)
}

// Pages that work perfectly well signed out. A stale token turning up on the
// pricing page should clear itself quietly, not throw the visitor at a login
// form they didn't ask for.
const PUBLIC_PATHS = ['/', '/pricing']

// Guard against a redirect loop: if we're already sitting on /auth, don't
// bounce again.
export function redirectToLogin(next) {
  if (typeof window === 'undefined') return
  if (window.location.pathname.startsWith('/auth')) return
  if (PUBLIC_PATHS.includes(window.location.pathname)) return

  const target = next || (window.location.pathname + window.location.search)
  window.location.replace(`/auth?next=${encodeURIComponent(target)}`)
}

// Tell the server to revoke the session too — clearing localStorage on its own
// leaves a perfectly usable refresh token behind.
export async function logout(apiBase) {
  const token = safeGet(TOKEN_KEY)
  const base  = apiBase || process.env.NEXT_PUBLIC_API_URL || ''
  if (token) {
    try {
      await fetch(`${base}/api/auth/logout`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      })
    } catch {
      // Revoking is best-effort; the local clear below is what the user sees.
    }
  }
  clearSession()
}
