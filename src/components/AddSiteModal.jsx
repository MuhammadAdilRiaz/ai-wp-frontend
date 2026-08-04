'use client'
import { useState } from 'react'

export default function AddSiteModal({ onClose, onSubmit, loading, error }) {
  const [siteUrl, setSiteUrl] = useState('')
  const [siteToken, setSiteToken] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!siteUrl.trim() || !siteToken.trim()) return
    onSubmit(siteUrl.trim(), siteToken.trim())
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{ width: 420, background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#18181b', margin: 0 }}>Add your WordPress website</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', fontSize: 18 }}>✕</button>
        </div>

        <p style={{ fontSize: 13, color: '#71717a', margin: '0 0 16px' }}>
          Install the AI WP Builder plugin on your WordPress site, then paste your site URL and the connection token shown in the plugin settings.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: '#3f3f46', display: 'block', marginBottom: 6 }}>Website URL</label>
          <input
            value={siteUrl}
            onChange={e => setSiteUrl(e.target.value)}
            placeholder="https://yoursite.com"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1px solid #e4e4e7', fontSize: 13.5, marginBottom: 14, boxSizing: 'border-box' }}
          />

          <label style={{ fontSize: 12.5, fontWeight: 600, color: '#3f3f46', display: 'block', marginBottom: 6 }}>Plugin connection token</label>
          <input
            value={siteToken}
            onChange={e => setSiteToken(e.target.value)}
            placeholder="Paste token from plugin settings"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1px solid #e4e4e7', fontSize: 13.5, marginBottom: 14, boxSizing: 'border-box' }}
          />

          {error && <p style={{ color: '#dc2626', fontSize: 12.5, margin: '0 0 12px' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '10px 0', borderRadius: 9, border: 'none', cursor: loading ? 'default' : 'pointer',
              background: '#18181b', color: '#fff', fontSize: 13.5, fontWeight: 600, opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Connecting...' : 'Connect website'}
          </button>
        </form>
      </div>
    </div>
  )
}