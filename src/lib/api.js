const BASE = process.env.NEXT_PUBLIC_API_URL || ''

async function apiFetch(path, options = {}, token = null) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res  = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const api = {
  signup:      (e, p)           => apiFetch('/api/auth/signup',  { method:'POST', body:JSON.stringify({email:e,password:p}) }),
  login:       (e, p)           => apiFetch('/api/auth/login',   { method:'POST', body:JSON.stringify({email:e,password:p}) }),
  me:          (t)              => apiFetch('/api/auth/me', {}, t),
  oauthUrl:    (provider)       => apiFetch(`/api/auth/oauth-url?provider=${provider}`),
  getSites:    (t)              => apiFetch('/api/sites', {}, t),
  connectSite: (url, tok, t)    => apiFetch('/api/sites/connect', { method:'POST', body:JSON.stringify({site_url:url,site_token:tok}) }, t),
  deleteSite:  (id, t)          => apiFetch(`/api/sites/${id}`, { method:'DELETE' }, t),
  sendMessage: (siteId, msg, history, t) =>
    apiFetch('/api/chat/message', { method:'POST', body:JSON.stringify({site_id:siteId,message:msg,history}) }, t),
  getHistory:  (siteId, t)      => apiFetch(`/api/chat/history?site_id=${siteId}`, {}, t),
  getCredits:  (t)              => apiFetch('/api/credits', {}, t),
  getPackages: ()               => apiFetch('/api/credits/packages'),
}
