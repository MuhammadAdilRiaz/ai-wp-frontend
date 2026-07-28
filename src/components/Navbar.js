'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 32px',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg, #f97316, #ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <span style={{
          fontWeight: 700, fontSize: 17,
          color: '#18181b', letterSpacing: '-0.02em',
        }}>
          AI WP Builder
        </span>
      </Link>

      {/* Center links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <Link href="/pricing" style={{
          fontSize: 14, fontWeight: 500, color: '#3f3f46',
          textDecoration: 'none',
        }}>
          Pricing
        </Link>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Link href="/auth" style={{
          fontSize: 14, fontWeight: 500, color: '#3f3f46',
          textDecoration: 'none',
          padding: '8px 16px', borderRadius: 8,
          background: 'rgba(255,255,255,0.3)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.4)',
          transition: 'all 0.15s',
        }}>
          Log in
        </Link>
        <Link href="/auth?mode=signup" style={{
          fontSize: 14, fontWeight: 600, color: '#fff',
          textDecoration: 'none',
          padding: '8px 18px', borderRadius: 10,
          background: '#18181b',
          border: '1px solid rgba(0,0,0,0.1)',
          transition: 'opacity 0.15s',
        }}>
          Get started
        </Link>
      </div>
    </nav>
  )
}