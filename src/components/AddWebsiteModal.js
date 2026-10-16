'use client'
import { useState } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

export default function AddWebsiteModal({ onClose, onConnected }) {
  const [url, setUrl] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!url.trim() || !token.trim()) return
    setLoading(true)
    setError('')
    try {
      const authToken = getToken()
      const { site } = await api.connectSite(url.trim(), token.trim(), authToken)
      onConnected(site)
      onClose()
    } catch (err) {
      setError(err.message || 'Could not connect to that site.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}
    >
      <div onClick={e => e.stopPropagation()} style={{ width:440, maxWidth:'90vw', background:'#fff', borderRadius:16, padding:24, boxShadow:'0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
          <h2 style={{ fontSize:17, fontWeight:700, color:'#18181b', margin:0 }}>Connect your WordPress site</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#a1a1aa', padding:4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <p style={{ fontSize:13, color:'#71717a', margin:'0 0 20px' }}>
          Install the Elimeni AI Connector plugin on your site, then paste its URL and connection token below.
        </p>

        <div style={{background:'#f5f3ff',padding:12,borderRadius:10,marginBottom:14,fontSize:12,color:'#4338ca'}}>
          <strong>Manual token connection</strong> — Your existing plugin token still works. <a href="/download" style={{color:'#4338ca',textDecoration:'underline'}}>Download connector plugin</a> if needed. Secure WordPress authorization will be available after the backend supports it.
        </div>
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize:12.5, fontWeight:600, color:'#3f3f46', display:'block', marginBottom:6 }}>Website URL</label>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://yoursite.com"
            style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #d4d4d8', fontSize:13.5, boxSizing:'border-box', marginBottom:16, fontFamily:'inherit' }}
          />

          <label style={{ fontSize:12.5, fontWeight:600, color:'#3f3f46', display:'block', marginBottom:6 }}>Connection token</label>
          <input
            type="password"
            autoComplete="off"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Paste the token from the plugin's settings page"
            style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #d4d4d8', fontSize:13.5, boxSizing:'border-box', marginBottom:16, fontFamily:'inherit' }}
          />

          {error && (
            <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'8px 12px', fontSize:12.5, color:'#991b1b', marginBottom:16 }}>
              {error}
            </div>
          )}

          <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding:'9px 16px', borderRadius:8, border:'1px solid #d4d4d8', background:'#fff', color:'#18181b', fontSize:13, fontWeight:600, cursor:'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading || !url.trim() || !token.trim()} style={{ padding:'9px 18px', borderRadius:8, border:'none', background:'#18181b', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Connecting…' : 'Connect site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
