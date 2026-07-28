'use client'
import { useState } from 'react'

const SITES = [
  { name: 'BrodBay', url: 'https://www.brodbay.com', builder: 'Elementor' },
]

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20z" />
    </svg>
  )
}

export default function DashboardHero({ user = { name: 'Adil' }, credits = 100 }) {
  const [tab, setTab] = useState('projects')
  const [prompt, setPrompt] = useState('')

  return (
    <div>
      <div className="hero-gradient" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '64px 24px 100px', textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 34, fontWeight: 700, color: '#18181b', letterSpacing: '-0.02em', marginBottom: 24 }}>
          What's the vision, {user.name}?
        </h1>

        <div style={{
          width: '100%', maxWidth: 640, background: '#fff', borderRadius: 16,
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)', padding: '14px 16px',
        }}>
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ask AI WP Builder to create a page"
            style={{
              width: '100%', border: 'none', outline: 'none', fontSize: 15,
              color: '#18181b', marginBottom: 10, background: 'transparent',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button style={{
              width: 26, height: 26, borderRadius: '50%', border: '1px solid #e4e4e7',
              background: '#fff', cursor: 'pointer', fontSize: 16, color: '#71717a',
            }}>
              +
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, color: '#71717a', display: 'flex', alignItems: 'center', gap: 4 }}>
                Build
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2">
                <path d="M12 1v14M8 5l4-4 4 4" /><path d="M4 15v4a2 2 0 002 2h12a2 2 0 002-2v-4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Card panel overlapping the gradient, like the Lovable "My projects" panel */}
      <div style={{
        maxWidth: 900, margin: '-56px auto 0', background: '#fff',
        border: '1px solid #e4e4e7', borderRadius: 16,
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)', position: 'relative', zIndex: 2,
        padding: 24,
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { id: 'projects', label: 'My projects' },
            { id: 'recent', label: 'Recently viewed' },
            { id: 'templates', label: 'Templates' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontSize: 13.5, fontWeight: 600,
                background: tab === t.id ? '#f4f4f5' : 'transparent',
                color: tab === t.id ? '#18181b' : '#71717a',
              }}
            >
              {t.label}
            </button>
          ))}
          <span style={{ flex: 1 }} />
          <a href="#" style={{ fontSize: 13, color: '#71717a', textDecoration: 'none' }}>Browse all →</a>
        </div>

        <p style={{ fontSize: 22, fontWeight: 700, color: '#18181b', margin: '0 0 4px' }}>Your sites</p>
        <p style={{ fontSize: 13.5, color: '#71717a', margin: '0 0 18px' }}>Connect a WordPress site to start building</p>

        {SITES.map(site => (
          <div key={site.name} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            border: '1px solid #e4e4e7', borderRadius: 12, padding: '14px 18px', marginBottom: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: '#eff6ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <GlobeIcon />
              </div>
              <div>
                <p style={{ fontSize: 14.5, fontWeight: 700, color: '#18181b', margin: 0 }}>{site.name}</p>
                <p style={{ fontSize: 12.5, color: '#a1a1aa', margin: '2px 0' }}>{site.url}</p>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#9333ea' }}>⚡ {site.builder}</span>
              </div>
            </div>
            <button style={{
              padding: '9px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: '#18181b', color: '#fff', fontSize: 13.5, fontWeight: 600,
            }}>
              Open chat →
            </button>
          </div>
        ))}

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #ede9fe, #f5f3ff)',
          borderRadius: 12, padding: '16px 18px',
        }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#18181b', margin: 0 }}>{credits} credits remaining</p>
            <p style={{ fontSize: 12.5, color: '#71717a', margin: '2px 0 0' }}>Each chat message costs 5 credits</p>
          </div>
          <button style={{
            padding: '9px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
            background: '#18181b', color: '#fff', fontSize: 13.5, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            💳 Buy credits
          </button>
        </div>
      </div>
    </div>
  )
}