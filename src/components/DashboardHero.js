'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const EXAMPLES = [
  'Build an elegant catering homepage with dark luxury design',
  'Create a hero section with a Book Now button',
  'Add a services section for Wedding and Corporate events',
  'Build a testimonials section with star ratings',
  'Create a contact form page',
]

export default function DashboardHero({ user, credits, sites = [], onAddSiteClick }) {
  const router = useRouter()
  const [value, setValue] = useState('')

  // Chat always needs a site to build on — there's no sandbox to spin up
  // out of thin air, only your real connected WordPress sites. With exactly
  // one connected, use it automatically. With none, send them to connect
  // one first instead of 404ing. With more than one, default to the most
  // recently updated (sites is already sorted that way by the backend) —
  // worth a proper picker later if multi-site turns out to be common.
  function startChat(prompt) {
    if (!prompt.trim()) return
    if (sites.length === 0) {
      onAddSiteClick?.()
      return
    }
    sessionStorage.setItem('pending_prompt', prompt)
    router.push(`/chat?site=${sites[0].id}`)
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      minHeight: '100vh', background: '#fafafa',
    }}>

      {/* Top bar */}
      <div style={{ background:'#fff', borderBottom:'1px solid #e4e4e7', padding:'14px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <h1 style={{ fontSize:18, fontWeight:700, color:'#18181b', margin:0 }}>
          Dashboard
        </h1>
        <div style={{ fontSize:12, fontWeight:600, background:'#18181b', color:'#fff', padding:'6px 14px', borderRadius:999 }}>
          ⚡ {credits} credits
        </div>
      </div>

      {/* Center prompt area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 24px', textAlign:'center' }}>

        <h2 style={{ fontSize:36, fontWeight:800, color:'#18181b', letterSpacing:'-0.02em', marginBottom:8 }}>
          What's the vision, {user?.name || 'there'}?
        </h2>
        <p style={{ fontSize:16, color:'#71717a', marginBottom:8 }}>
          Describe what you want to build on your WordPress site
        </p>
        {sites.length === 0 && (
          <p style={{ fontSize:13, color:'#ea580c', marginBottom:28 }}>
            Connect your website first — click "Add your website" in the sidebar.
          </p>
        )}

        {/* Prompt box */}
        <div style={{ width:'100%', maxWidth:640, background:'#fff', border:'1.5px solid #e4e4e7', borderRadius:18, boxShadow:'0 4px 24px rgba(0,0,0,0.06)', overflow:'hidden', marginBottom:16, marginTop: sites.length === 0 ? 0 : 28 }}
          onFocusCapture={e => e.currentTarget.style.borderColor = '#5271ff'}
          onBlurCapture={e => e.currentTarget.style.borderColor = '#e4e4e7'}
        >
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Ask AI WP Builder to build..."
            rows={3}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                startChat(value)
              }
            }}
            style={{ width:'100%', border:'none', outline:'none', padding:'18px 20px 10px', fontSize:15, color:'#18181b', background:'transparent', resize:'none', fontFamily:'inherit', lineHeight:1.5, boxSizing:'border-box' }}
          />
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 12px 14px' }}>
            <span style={{ fontSize:12, color:'#a1a1aa' }}>Enter to build · Shift+Enter new line</span>
            <button
              onClick={() => startChat(value)}
              disabled={!value.trim()}
              style={{ background:'#18181b', color:'#fff', border:'none', borderRadius:10, padding:'8px 18px', fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit', opacity: value.trim() ? 1 : 0.5 }}
            >
              Build →
            </button>
          </div>
        </div>

        {/* Example prompts */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => startChat(ex)}
              style={{ fontSize:12, fontWeight:500, padding:'6px 14px', borderRadius:999, border:'1px solid #e4e4e7', background:'#fff', color:'#52525b', cursor:'pointer', fontFamily:'inherit' }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
