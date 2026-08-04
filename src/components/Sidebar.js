'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'home' },
  { label: 'Search', href: '#', icon: 'search', shortcut: 'Ctrl K' },
  { label: 'Resources', href: '#', icon: 'compass' },
  { label: 'Connectors', href: '#', icon: 'plug' },
]

const PROJECT_ITEMS = [
  { label: 'All projects', icon: 'grid' },
  { label: 'Starred', icon: 'star' },
  { label: 'Created by me', icon: 'user' },
]

function Icon({ name }) {
  const props = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }
  switch (name) {
    case 'home': return <svg {...props}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
    case 'search': return <svg {...props}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
    case 'compass': return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M15 9l-3 6-3-6 6 0z" /></svg>
    case 'plug': return <svg {...props}><path d="M9 2v6M15 2v6M6 8h12l-1 5a5 5 0 01-10 0L6 8z" /><path d="M12 17v5" /></svg>
    case 'grid': return <svg {...props}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
    case 'star': return <svg {...props}><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9" /></svg>
    case 'user': return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
    case 'gift': return <svg {...props}><rect x="3" y="8" width="18" height="13" rx="1" /><path d="M12 8v13M3 12h18M12 8c-1.5 0-3-1-3-2.5S10.5 3 12 4c1.5-1 3 0 3 1.5S13.5 8 12 8zM12 8c1.5 0 3-1 3-2.5" /></svg>
    case 'bolt': return <svg {...props} fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
    case 'mail': return <svg {...props}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 6l10 7 10-7" /></svg>
    case 'panel': return <svg {...props}><rect x="3" y="4" width="18" height="16" rx="2" /><line x1="9" y1="4" x2="9" y2="20" /></svg>
    case 'chevron': return <svg {...props}><polyline points="6 9 12 15 18 9" /></svg>
    // add to the Icon() switch:
case 'globe': return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20z" /></svg>
case 'plus': return <svg {...props}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
    default: return null
  }
}

export default function Sidebar({ user = { name: 'Adil', email: 'multi.xpert5r@gmail.com', initial: 'A' } }) {
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setSwitcherOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <aside style={{
      width: 260, minHeight: '100vh', display: 'flex', flexDirection: 'column',
      borderRight: '1px solid #e4e4e7', background: '#fff', padding: '16px 12px',
      boxSizing: 'border-box',
    }}>
      {/* Top row: logo + collapse */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 12px' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'linear-gradient(135deg, #f97316, #ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', padding: 4 }}>
          <Icon name="panel" />
        </button>
      </div>

      {/* Workspace dropdown trigger */}
      <div ref={wrapRef} style={{ position: 'relative', marginBottom: 16 }}>
        <button
          onClick={() => setSwitcherOpen(o => !o)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: switcherOpen ? '#f4f4f5' : 'transparent',
          }}
        >
          <div style={{
            width: 24, height: 24, borderRadius: 6, background: '#ea580c', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            {user.initial}
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#18181b', flex: 1, textAlign: 'left' }}>
            {user.name}'s AI WP
          </span>
          <span style={{ color: '#a1a1aa' }}><Icon name="chevron" /></span>
        </button>

        {switcherOpen && <WorkspaceSwitcher user={user} onClose={() => setSwitcherOpen(false)} />}
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
        {NAV_ITEMS.map(item => (
          <Link key={item.label} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 8, textDecoration: 'none',
            color: '#3f3f46', fontSize: 13.5, fontWeight: 500,
          }}>
            <Icon name={item.icon} />
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.shortcut && <span style={{ fontSize: 11, color: '#a1a1aa' }}>{item.shortcut}</span>}
          </Link>
        ))}
      </nav>

      {/* Projects */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: '#a1a1aa', padding: '0 10px', marginBottom: 6 }}>Projects</p>
        {PROJECT_ITEMS.map(item => (
          <a key={item.label} href="#" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 8, textDecoration: 'none',
            color: '#3f3f46', fontSize: 13.5, fontWeight: 500,
          }}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </a>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Share + Upgrade cards */}
      <div style={{
        border: '1px solid #e4e4e7', borderRadius: 12, padding: 12, marginBottom: 10,
        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
      }}>
        <span style={{ color: '#3f3f46' }}><Icon name="gift" /></span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#18181b', margin: 0 }}>Share AI WP Builder</p>
          <p style={{ fontSize: 11.5, color: '#71717a', margin: 0 }}>100 credits per paid referral</p>
        </div>
      </div>

      <div style={{
        border: '1px solid #e4e4e7', borderRadius: 12, padding: 12, marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
      }}>
        <span style={{
          width: 26, height: 26, borderRadius: 8, background: '#f4f4f5',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#18181b', flexShrink: 0,
        }}>
          <Icon name="bolt" />
        </span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#18181b', margin: 0 }}>Upgrade to Pro</p>
          <p style={{ fontSize: 11.5, color: '#71717a', margin: 0 }}>Unlock more features</p>
        </div>
      </div>

      {/* Profile — bottom left */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 6px', borderTop: '1px solid #e4e4e7', paddingTop: 12,
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
          }}>
            {user.initial}
          </div>
          <span style={{
            position: 'absolute', bottom: -1, right: -1, width: 8, height: 8, borderRadius: '50%',
            background: '#22c55e', border: '2px solid #fff',
          }} />
        </div>
        <span style={{ fontSize: 12.5, color: '#52525b', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.email}
        </span>
        <span style={{ color: '#a1a1aa' }}><Icon name="mail" /></span>
      </div>
    </aside>
  )
}

function WorkspaceSwitcher({ user, onClose }) {
  const creditsLeft = 5
  const creditsTotal = 100
  const pct = Math.min(100, (creditsLeft / creditsTotal) * 100)

  return (
    <div style={{
      position: 'absolute', top: '110%', left: 0, width: 280,
      background: '#fff', border: '1px solid #e4e4e7', borderRadius: 16,
      boxShadow: '0 12px 32px rgba(0,0,0,0.12)', padding: 14, zIndex: 30,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, background: '#ea580c', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700,
        }}>
          {user.initial}
        </div>
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: '#18181b', margin: 0 }}>{user.name}'s AI WP</p>
          <p style={{ fontSize: 12, color: '#71717a', margin: 0 }}>Free Plan · 1 member</p>
        </div>
      </div>

      <button style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '8px 0', borderRadius: 9, border: '1px solid #e4e4e7', background: '#fff',
        fontSize: 13, fontWeight: 500, color: '#18181b', cursor: 'pointer', marginBottom: 14,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="7" r="4" /><path d="M2 21c0-4 3-6 7-6s7 2 7 6" /><path d="M19 8v6M16 11h6" />
        </svg>
        Invite members
      </button>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
          <span style={{ fontWeight: 600, color: '#18181b' }}>Credits</span>
          <span style={{ color: '#71717a' }}>{creditsLeft} left</span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: '#f4f4f5', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: '#2563eb', borderRadius: 999 }} />
        </div>
        <p style={{ fontSize: 11, color: '#a1a1aa', marginTop: 6 }}>Daily credits reset at midnight UTC</p>
      </div>

      <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 8, display: 'flex', flexDirection: 'column' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#3f3f46', textAlign: 'left' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          New workspace
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#3f3f46', textAlign: 'left' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
          Settings
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 4px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#3f3f46' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            Turn Pro
          </span>
          <button style={{
            padding: '5px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: '#e9d5ff', color: '#7e22ce', fontSize: 12, fontWeight: 700,
          }}>
            Upgrade
          </button>
        </div>
      </div>
    </div>
  )
}