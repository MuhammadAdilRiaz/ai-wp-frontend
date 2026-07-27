'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 32px',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #f97316, #ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#18181b', letterSpacing: '-0.02em' }}>
          AI WP Builder
        </span>
      </Link>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link href="/auth" style={{
          fontSize: 14, fontWeight: 500, color: '#3f3f46',
          textDecoration: 'none', padding: '8px 16px',
          borderRadius: 8, transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.target.style.background = 'rgba(0,0,0,0.05)'}
          onMouseLeave={e => e.target.style.background = 'transparent'}
        >
          Log in
        </Link>
        <Link href="/auth?mode=signup" style={{
          fontSize: 14, fontWeight: 600, color: '#fff',
          textDecoration: 'none', padding: '8px 18px',
          background: '#18181b', borderRadius: 10,
          transition: 'opacity 0.15s',
        }}>
          Get started
        </Link>
      </div>
    </nav>
  )
}
