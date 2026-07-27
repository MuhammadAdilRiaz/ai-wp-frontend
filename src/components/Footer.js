import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: '#18181b',
      padding: '40px 24px',
      borderTop: '1px solid #27272a',
    }}>
      <div style={{
        maxWidth: 960, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'linear-gradient(135deg,#f97316,#ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>AI WP Builder</span>
        </div>

        <div style={{ display: 'flex', gap: 24 }}>
          {['Pricing', 'Contact', 'Privacy'].map(link => (
            <Link key={link} href="#" style={{ fontSize: 13, color: '#71717a', textDecoration: 'none' }}>
              {link}
            </Link>
          ))}
        </div>

        <p style={{ fontSize: 13, color: '#52525b', margin: 0 }}>
          © 2026 AI WP Builder — Powered by Claude AI
        </p>
      </div>
    </footer>
  )
}
