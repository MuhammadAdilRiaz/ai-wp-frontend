'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const EXAMPLES = [
  'Build an elegant catering homepage with dark luxury design',
  'Create a hero section with a Book Now button',
  'Add a services section for Wedding and Corporate events',
  'Build a testimonials section with star ratings',
  'Create a contact form page',
  'Make my site look like a 5-star restaurant',
]

export default function PromptInput() {
  const [prompt, setPrompt] = useState('')
  const [focused, setFocused] = useState(false)
  const textRef = useRef(null)
  const router  = useRouter()

  function go(e) {
    e?.preventDefault()
    if (!prompt.trim()) return
    sessionStorage.setItem('pending_prompt', prompt.trim())
    router.push('/auth?next=/chat')
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); go() }
  }

  return (
    <div className="fade-up-delay-2" style={{ width: '100%', maxWidth: 680 }}>

      {/* ── Main input box ── */}
      <div style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        borderRadius: 20,
        border: focused ? '1.5px solid rgba(82,113,255,0.6)' : '1.5px solid rgba(255,255,255,0.8)',
        boxShadow: focused
          ? '0 0 0 4px rgba(82,113,255,0.12), 0 8px 40px rgba(0,0,0,0.12)'
          : '0 4px 32px rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
        overflow: 'hidden',
      }}>
        <textarea
          ref={textRef}
          value={prompt}
          onChange={e => {
            setPrompt(e.target.value)
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={onKey}
          placeholder="Ask AI WP Builder to build a WordPress page..."
          rows={2}
          style={{
            width: '100%',
            padding: '20px 20px 10px',
            fontSize: 16,
            lineHeight: 1.5,
            color: '#18181b',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontFamily: 'inherit',
            maxHeight: 160,
            overflow: 'auto',
          }}
        />

        {/* Bottom toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px 14px',
        }}>
          {/* Left — attach button */}
          <button style={{
            width: 32, height: 32, borderRadius: '50%',
            border: '1.5px solid #e4e4e7',
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#71717a',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>

          {/* Right — Build button + mode */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: '#f4f4f5', borderRadius: 8,
              padding: '6px 10px', fontSize: 13, fontWeight: 500,
              color: '#52525b', cursor: 'pointer',
            }}>
              Build
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>

            <button
              onClick={go}
              disabled={!prompt.trim()}
              style={{
                width: 34, height: 34, borderRadius: '50%',
                border: 'none',
                background: prompt.trim()
                  ? 'linear-gradient(135deg,#52525b,#18181b)'
                  : '#e4e4e7',
                color: prompt.trim() ? '#fff' : '#a1a1aa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: prompt.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"/>
                <polyline points="5 12 12 5 19 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Example prompts ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap',
        gap: 8, justifyContent: 'center',
        marginTop: 16,
      }}>
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            onClick={() => setPrompt(ex)}
            style={{
              fontSize: 12, fontWeight: 500,
              padding: '6px 14px',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.7)',
              borderRadius: 999,
              color: '#3f3f46',
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.6)' }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}
