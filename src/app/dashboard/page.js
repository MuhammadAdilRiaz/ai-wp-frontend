import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Download Elimeni AI Connector for WordPress',
  description:
    'Download the Elimeni AI Connector plugin for WordPress. Install it, copy your site token, and start building pages by chat.',
}

// Kept in one place so the button, the meta line and the manual-install
// instructions can never disagree about which file they describe.
const PLUGIN = {
  file: '/elimeni-ai-connector.zip',
  name: 'elimeni-ai-connector.zip',
  version: '1.2.0',
  author: 'Adil Riaz',
  developer: 'Devoptex',
  developerUrl: 'https://www.devoptex.com',
  size: '590 KB',
}

const STEPS = [
  {
    n: '1',
    title: 'Download the plugin',
    desc: 'Grab the .zip below. Leave it zipped — WordPress wants the archive, not the extracted folder.',
  },
  {
    n: '2',
    title: 'Upload it to WordPress',
    desc: 'In your admin, go to Plugins → Add New → Upload Plugin, choose the .zip, then Install Now.',
  },
  {
    n: '3',
    title: 'Activate',
    desc: 'Click Activate. An “Elimeni AI” item appears in your WordPress sidebar, and your site token is generated.',
  },
  {
    n: '4',
    title: 'Connect your site',
    desc: 'Open Elimeni AI → Settings, copy the site token, and paste it with your site URL into “Add your website”.',
  },
]

const ABILITIES = [
  { icon: '📄', title: 'Build pages', desc: 'Create and update WordPress pages from a chat message.' },
  { icon: '⚡', title: 'Elementor layouts', desc: 'Generate real Elementor sections, columns and widgets.' },
  { icon: '🏠', title: 'Set the homepage', desc: 'Promote any page it builds to be your front page.' },
  { icon: '🗂️', title: 'Menus', desc: 'Create navigation menus and add pages to them.' },
  { icon: '🖼️', title: 'Media', desc: 'Pull images into your media library from a URL.' },
  { icon: '⚙️', title: 'Site settings', desc: 'Update safe options like site title and tagline — nothing else.' },
]

const REQUIREMENTS = [
  ['WordPress', '5.8 or newer'],
  ['PHP', '7.4 or newer'],
  ['Elementor', 'Optional — needed only for Elementor layouts'],
  ['REST API', 'Enabled (it is, unless you disabled it)'],
]

const sectionTitle = {
  fontSize: 'clamp(26px, 5vw, 36px)',
  fontWeight: 800,
  color: '#18181b',
  letterSpacing: '-0.02em',
  marginBottom: 10,
}

const sectionSub = { fontSize: 17, color: '#71717a', lineHeight: 1.6 }

const card = {
  background: '#fff',
  border: '1px solid #e4e4e7',
  borderRadius: 16,
  padding: 24,
}

// Small helper so the code blocks in the manual-install section all match.
function Code({ children }) {
  return (
    <code
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 13,
        background: '#f4f4f5',
        border: '1px solid #e4e4e7',
        borderRadius: 6,
        padding: '2px 7px',
        color: '#18181b',
        whiteSpace: 'normal',
        overflowWrap: 'anywhere',
      }}
    >
      {children}
    </code>
  )
}

export default function DownloadPage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="hero-gradient" style={{ display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <section
          style={{
            padding: 'clamp(48px, 8vw, 72px) 24px clamp(64px, 10vw, 96px)',
            maxWidth: 820,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div
            className="fade-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
              color: '#3f3f46',
              background: 'rgba(255,255,255,0.45)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.6)',
              borderRadius: 999,
              padding: '6px 14px',
              marginBottom: 22,
            }}
          >
            <span style={{ fontSize: 14 }}>🔌</span>
            WordPress plugin · v{PLUGIN.version}
          </div>

          <p style={{ fontSize: 13, color: '#52525b', margin: '0 0 16px' }}>
            By <strong>{PLUGIN.author}</strong> · Developed by{' '}
            <a href={PLUGIN.developerUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
              {PLUGIN.developer}
            </a>
          </p>

          <h1
            className="fade-up-delay-1"
            style={{
              fontSize: 'clamp(32px, 7vw, 52px)',
              lineHeight: 1.08,
              fontWeight: 800,
              color: '#18181b',
              letterSpacing: '-0.03em',
              marginBottom: 18,
            }}
          >
            Connect WordPress
            <br />
            in about two minutes
          </h1>

          <p
            className="fade-up-delay-2"
            style={{
              fontSize: 18,
              color: '#3f3f46',
              lineHeight: 1.6,
              maxWidth: 560,
              margin: '0 auto 34px',
            }}
          >
            One small plugin is the bridge between your site and the AI. Install it,
            paste your token, and start building pages by chatting.
          </p>

          <div
            className="fade-up-delay-3"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <a
              href={PLUGIN.file}
              download
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: '#18181b',
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                padding: '14px 26px',
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download plugin
            </a>

            <Link
              href="/auth?mode=signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: 15,
                fontWeight: 500,
                color: '#3f3f46',
                textDecoration: 'none',
                padding: '14px 22px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.35)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.5)',
              }}
            >
              Create an account
            </Link>
          </div>

          <p style={{ fontSize: 13, color: '#52525b', marginTop: 16 }}>
            {PLUGIN.name} · {PLUGIN.size} · Free · GPL-2.0
          </p>
        </section>
      </div>

      {/* ── Install steps ────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '96px 24px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={sectionTitle}>Installing it</h2>
            <p style={sectionSub}>Four steps, no configuration files to edit</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 24,
            }}
          >
            {STEPS.map(step => (
              <div key={step.n} style={{ ...card, background: '#fafafa' }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #f97316, #ec4899)',
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  {step.n}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#18181b', marginBottom: 8 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14.5, color: '#71717a', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What it can do ───────────────────────────────────────────────── */}
      <section style={{ background: '#fafafa', padding: '96px 24px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={sectionTitle}>What the plugin lets the AI do</h2>
            <p style={sectionSub}>
              It only exposes these actions — nothing else on your site is reachable
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {ABILITIES.map(a => (
              <div key={a.title} style={card}>
                <div style={{ fontSize: 22, marginBottom: 12 }}>{a.icon}</div>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#18181b', marginBottom: 6 }}>
                  {a.title}
                </h3>
                <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.6 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Manual installation ──────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '96px 24px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <h2 style={sectionTitle}>Manual installation</h2>
            <p style={sectionSub}>
              If your host blocks plugin uploads, or the .zip upload fails, install it over
              FTP or your file manager instead.
            </p>
          </div>

          <ol
            style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 22,
              counterReset: 'manual',
            }}
          >
            {[
              <>Download <Code>{PLUGIN.name}</Code> and unzip it on your computer. You should end up with a folder called <Code>ai-wp-builder</Code>.</>,
              <>Connect to your hosting with FTP, SFTP, or your control panel’s File Manager.</>,
              <>Open <Code>/wp-content/plugins/</Code> in your site’s root directory.</>,
              <>Upload the whole <Code>ai-wp-builder</Code> folder into it, so the plugin file sits at <Code>/wp-content/plugins/ai-wp-builder/ai-wp-builder.php</Code>.</>,
              <>In WordPress, go to <strong>Plugins</strong>. “Elimeni AI Connector” will be listed — click <strong>Activate</strong>.</>,
              <>Open <strong>Elimeni AI → Settings</strong> in the sidebar and copy your site token.</>,
            ].map((text, i) => (
              <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span
                  style={{
                    flexShrink: 0,
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    background: '#18181b',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 1,
                  }}
                >
                  {i + 1}
                </span>
                <p style={{ fontSize: 15, color: '#3f3f46', lineHeight: 1.75 }}>{text}</p>
              </li>
            ))}
          </ol>

          <div
            style={{
              ...card,
              background: '#fffbeb',
              borderColor: '#fde68a',
              marginTop: 34,
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1.4 }}>💡</span>
            <p style={{ fontSize: 14.5, color: '#713f12', lineHeight: 1.65 }}>
              Upload the <strong>folder</strong>, not the .zip, when installing manually. If you
              already tried the .zip through WordPress and it failed, delete any half-installed
              copy from <Code>/wp-content/plugins/</Code> first.
            </p>
          </div>
        </div>
      </section>

      {/* ── Requirements ─────────────────────────────────────────────────── */}
      <section style={{ background: '#fafafa', padding: '96px 24px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={sectionTitle}>Requirements</h2>
          </div>

          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
            {REQUIREMENTS.map(([label, value], i) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '18px 24px',
                  borderTop: i === 0 ? 'none' : '1px solid #f0f0f0',
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: '#18181b' }}>{label}</span>
                <span style={{ fontSize: 14.5, color: '#71717a' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '96px 24px', borderTop: '1px solid #f0f0f0' }}>
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            textAlign: 'center',
            background: '#18181b',
            borderRadius: 24,
            padding: '56px 32px',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(24px, 4.5vw, 30px)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.02em',
              marginBottom: 12,
            }}
          >
            Ready to build?
          </h2>
          <p style={{ fontSize: 16, color: '#a1a1aa', lineHeight: 1.6, marginBottom: 30 }}>
            Install the plugin, connect your site, and describe the page you want.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <a
              href={PLUGIN.file}
              download
              style={{
                background: '#fff',
                color: '#18181b',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                padding: '13px 26px',
                borderRadius: 12,
              }}
            >
              Download plugin
            </a>
            <Link
              href="/pricing"
              style={{
                color: '#e4e4e7',
                fontSize: 15,
                fontWeight: 500,
                textDecoration: 'none',
                padding: '13px 22px',
                borderRadius: 12,
                border: '1px solid #3f3f46',
              }}
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
