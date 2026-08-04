'use client'
export default function BuyCreditsModal({ onClose, onBuy }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{ width: 380, background: '#fff', borderRadius: 16, padding: 24, textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: 30, marginBottom: 8 }}>💳</div>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#18181b', margin: '0 0 6px' }}>You're out of credits</h2>
        <p style={{ fontSize: 13, color: '#71717a', margin: '0 0 20px' }}>
          Buy more credits to keep chatting and building with AI WP Builder.
        </p>
        <button
          onClick={onBuy}
          style={{ width: '100%', padding: '10px 0', borderRadius: 9, border: 'none', cursor: 'pointer', background: '#18181b', color: '#fff', fontSize: 13.5, fontWeight: 600, marginBottom: 10 }}
        >
          Buy credits
        </button>
        <button
          onClick={onClose}
          style={{ width: '100%', padding: '10px 0', borderRadius: 9, border: '1px solid #e4e4e7', cursor: 'pointer', background: '#fff', color: '#3f3f46', fontSize: 13.5, fontWeight: 600 }}
        >
          Not now
        </button>
      </div>
    </div>
  )
}