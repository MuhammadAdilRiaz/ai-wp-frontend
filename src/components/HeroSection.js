import AnnouncementBadge from './AnnouncementBadge'
import PromptInput from './PromptInput'

export default function HeroSection() {
  return (
    <section className="hero-gradient" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Content centered */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px 80px',
        textAlign: 'center',
      }}>
        <AnnouncementBadge />

        <h1 className="fade-up-delay-1" style={{
          fontSize: 'clamp(40px, 6vw, 68px)',
          fontWeight: 800,
          color: '#18181b',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: 16,
          maxWidth: 700,
        }}>
          Build something WordPress
        </h1>

        <p className="fade-up-delay-1" style={{
          fontSize: 18,
          color: '#52525b',
          marginBottom: 40,
          fontWeight: 400,
          lineHeight: 1.6,
        }}>
          Build WordPress sites by chatting with AI
        </p>

        <PromptInput />
      </div>
    </section>
  )
}
