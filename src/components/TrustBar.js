const ITEMS = [
  { icon: '🌐', label: 'Any WordPress site' },
  { icon: '⚡', label: 'Builds Elementor pages' },
  { icon: '🎁', label: '100 free credits to start' },
  { icon: '🔄', label: '+10 credits every 24h free' },
  { icon: '🔒', label: 'Secure token auth' },
]

export default function TrustBar() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.5)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(255,255,255,0.4)',
      padding: '16px 24px',
    }}>
      <div style={{
        maxWidth: 900, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 32,
        flexWrap: 'wrap',
      }}>
        {ITEMS.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 13, color: '#52525b', fontWeight: 500,
          }}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
