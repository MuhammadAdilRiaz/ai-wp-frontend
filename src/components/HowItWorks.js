const STEPS = [
  {
    n: '1',
    icon: '🔌',
    title: 'Install plugin',
    desc: 'Install the AI WP Builder plugin on your WordPress site. Takes 2 minutes.',
  },
  {
    n: '2',
    icon: '💬',
    title: 'Chat to build',
    desc: 'Connect your site, then describe what you want to build in plain English.',
  },
  {
    n: '3',
    icon: '⚡',
    title: 'See it live',
    desc: 'AI builds real Elementor pages instantly. Preview them inside WordPress.',
  },
]

export default function HowItWorks() {
  return (
    <section style={{
      background: '#fff',
      padding: '96px 24px',
      borderTop: '1px solid #f0f0f0',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{
            fontSize: 36, fontWeight: 800,
            color: '#18181b', letterSpacing: '-0.02em',
            marginBottom: 10,
          }}>
            How it works
          </h2>
          <p style={{ fontSize: 17, color: '#71717a', lineHeight: 1.6 }}>
            From idea to live WordPress page in minutes
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
        }}>
          {STEPS.map(step => (
            <div key={step.n} style={{
              background: '#fafafa',
              border: '1px solid #f0f0f0',
              borderRadius: 20,
              padding: '32px 28px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Step number watermark */}
              <div style={{
                position: 'absolute', top: -10, right: 16,
                fontSize: 80, fontWeight: 900,
                color: '#f4f4f5', lineHeight: 1,
                userSelect: 'none', pointerEvents: 'none',
              }}>
                {step.n}
              </div>

              <div style={{ fontSize: 32, marginBottom: 16 }}>{step.icon}</div>
              <h3 style={{
                fontSize: 18, fontWeight: 700,
                color: '#18181b', marginBottom: 8,
              }}>
                {step.title}
              </h3>
              <p style={{
                fontSize: 14, color: '#71717a',
                lineHeight: 1.7, margin: 0,
              }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
