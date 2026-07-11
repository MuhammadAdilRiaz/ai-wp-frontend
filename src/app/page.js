'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const EXAMPLES = [
  'Build an elegant catering homepage with dark luxury design',
  'Create a hero section with a gold Book Now button',
  'Add a services section for Wedding, Corporate and Private events',
  'Build a testimonials section with gold star ratings',
  'Create a contact form with name, email and message',
  'Make my site look like a 5-star restaurant website',
]

export default function HomePage() {
  const [prompt, setPrompt]   = useState('')
  const [focused, setFocused] = useState(false)
  const router = useRouter()

  function go(e) {
    e?.preventDefault()
    if (!prompt.trim()) return
    sessionStorage.setItem('pending_prompt', prompt.trim())
    router.push('/auth?next=/chat')
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <Logo />
        <div className="flex items-center gap-2">
          <Link href="/auth" className="text-sm text-zinc-600 hover:text-zinc-900 px-3 py-1.5 transition-colors">Log in</Link>
          <Link href="/auth?mode=signup" className="text-sm bg-zinc-900 text-white px-4 py-2 rounded-xl hover:bg-zinc-700 transition-colors font-medium">Get started free</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-white/80 border border-zinc-200 rounded-full px-4 py-1.5 text-sm text-zinc-500 mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          Powered by Claude AI — Builds real Elementor pages
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 max-w-3xl leading-tight tracking-tight mb-5">
          Build your WordPress site<br />
          <span style={{background:'linear-gradient(135deg,#5271ff,#a855f7)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            by chatting with AI
          </span>
        </h1>

        <p className="text-xl text-zinc-500 max-w-lg mb-12 leading-relaxed">
          Describe what you want. AI builds it live on your WordPress site using Elementor — no coding required.
        </p>

        <div className="w-full max-w-2xl">
          <form onSubmit={go}>
            <div style={{background:'#fff',borderRadius:18,border:focused?'1.5px solid #5271ff':'1.5px solid #e4e4e7',boxShadow:focused?'0 0 0 4px #5271ff18,0 8px 32px #0001':'0 4px 24px #0000000d',transition:'all 0.2s'}}>
              <textarea
                value={prompt}
                onChange={e=>setPrompt(e.target.value)}
                onFocus={()=>setFocused(true)}
                onBlur={()=>setFocused(false)}
                onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey)go(e)}}
                placeholder="Describe the website you want to build..."
                rows={3}
                style={{width:'100%',padding:'18px 20px 10px',fontSize:16,color:'#18181b',background:'transparent',border:'none',outline:'none',resize:'none',borderRadius:18,fontFamily:'inherit'}}
              />
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 14px 14px'}}>
                <span style={{fontSize:12,color:'#a1a1aa'}}>Enter to build · Shift+Enter for new line</span>
                <button type="submit" disabled={!prompt.trim()} style={{display:'flex',alignItems:'center',gap:6,background:prompt.trim()?'#18181b':'#e4e4e7',color:prompt.trim()?'#fff':'#a1a1aa',border:'none',borderRadius:12,padding:'9px 18px',fontSize:14,fontWeight:500,cursor:prompt.trim()?'pointer':'not-allowed',transition:'all 0.15s',fontFamily:'inherit'}}>
                  Build site →
                </button>
              </div>
            </div>
          </form>

          <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginTop:16}}>
            {EXAMPLES.map((ex,i)=>(
              <button key={i} onClick={()=>setPrompt(ex)} style={{fontSize:12,padding:'6px 14px',background:'rgba(255,255,255,0.8)',border:'1px solid #e4e4e7',borderRadius:999,color:'#52525b',cursor:'pointer',fontFamily:'inherit'}}>
                {ex}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 mt-14 text-sm text-zinc-400 flex-wrap justify-center">
          {['🌐 Any WordPress site','⚡ Builds Elementor pages','🎁 100 free credits','🔒 Secure token auth'].map((t,i)=>(
            <span key={i}>{t}</span>
          ))}
        </div>
      </main>

      <section className="bg-zinc-50 border-t border-zinc-100 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-zinc-900 mb-3">How it works</h2>
          <p className="text-zinc-500 mb-12">Three steps from idea to live website</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {n:'1',title:'Install plugin',desc:'Install the AI WP Builder plugin on your WordPress site. Takes 2 minutes.'},
              {n:'2',title:'Connect & chat',desc:'Paste your site token, then describe your website in plain English.'},
              {n:'3',title:'See it live',desc:'AI builds your Elementor pages instantly. Preview right inside WordPress.'},
            ].map(s=>(
              <div key={s.n} className="bg-white border border-zinc-200 rounded-2xl p-7 text-left">
                <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#5271ff,#a855f7)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:'#fff',marginBottom:14}}>{s.n}</div>
                <h3 className="font-semibold text-zinc-900 mb-2">{s.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-100 py-6 text-center text-sm text-zinc-400">
        © 2026 AI WP Builder — Powered by Claude AI
      </footer>
    </div>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2 font-semibold text-zinc-900 text-lg">
      <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#5271ff,#a855f7)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      </div>
      AI WP Builder
    </div>
  )
}
