export default function AnnouncementBadge() {
  return (
    <div className="fade-up" style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.6)',
      borderRadius: 999,
      padding: '6px 14px 6px 6px',
      marginBottom: 28,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      cursor: 'pointer',
    }}>
      <span style={{
        background: '#5271ff',
        color: '#fff',
        fontSize: 11,
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: 999,
        letterSpacing: '0.02em',
      }}>
        New
      </span>
      <span style={{ fontSize: 13, fontWeight: 500, color: '#3f3f46' }}>
        Build WordPress sites by chatting with AI
      </span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </div>
  )
}
