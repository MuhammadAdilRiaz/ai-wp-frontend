'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'

function ChatUI() {
  const router  = useRouter()
  const params  = useSearchParams()
  const siteId  = params.get('site')
  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState('')
  const [sending, setSending]     = useState(false)
  const [credits, setCredits]     = useState(0)
  const [site, setSite]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [imagePreview, setImagePreview] = useState(null)
  const [showUpgrade, setShowUpgrade]   = useState(false)
  const bottomRef = useRef(null)
  const fileRef   = useRef(null)
  const textRef   = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('aiwpb_token')
    if (!token || !siteId) { router.push('/dashboard'); return }
    init(token)
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  async function init(token) {
    try {
      const [sitesData, creditsData, histData] = await Promise.all([
        api.getSites(token), api.getCredits(token), api.getHistory(siteId, token)
      ])
      const found = sitesData.sites?.find(s => s.id === siteId)
      if (!found) { router.push('/dashboard'); return }
      setSite(found); setCredits(creditsData.credits || 0)
      const hist = histData.history || []
      if (hist.length > 0) {
        setMessages(hist.map(h => ({ role:h.role, text:h.content, actions:h.metadata?.actions||[], results:h.metadata?.results||[] })))
      } else {
        setMessages([{ role:'assistant', text:`Hi! I am ready to build your site. **${found.site_name||found.site_url}** is connected${found.elementor?' with Elementor ⚡':''}.\n\nTell me what you want to build!`, actions:[] }])
      }
      const pending = sessionStorage.getItem('pending_prompt')
      if (pending) { sessionStorage.removeItem('pending_prompt'); setInput(pending) }
    } catch { router.push('/auth') }
    finally { setLoading(false) }
  }

  async function send() {
    if (!input.trim() || sending) return
    const token = localStorage.getItem('aiwpb_token')
    const userMsg = input.trim()
    setInput(''); setImagePreview(null); setSending(true)
    setMessages(p => [...p, { role:'user', text:userMsg, imagePreview }])
    const history = messages.slice(-10).map(m => ({ role:m.role, content:m.text }))
    try {
      const data = await api.sendMessage(siteId, userMsg, history, token)
      setCredits(data.credits_left || 0)
      setMessages(p => [...p, { role:'assistant', text:data.message, actions:data.actions||[], results:data.action_results||[], credits_used:data.credits_used }])
    } catch(err) {
      if (err.message?.includes('credits')) { setShowUpgrade(true) }
      setMessages(p => [...p, { role:'assistant', text:err.message?.includes('credits')?'You are out of credits. Please top up to continue.':`Error: ${err.message}`, actions:[], isError:true }])
    } finally { setSending(false) }
  }

  function onKey(e) { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send() } }
  function onFile(e) { const f=e.target.files?.[0]; if(!f) return; setImagePreview(URL.createObjectURL(f)) }

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#a1a1aa',fontSize:14}}>Loading chat...</div>

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#fafafa',fontFamily:'Inter,system-ui,sans-serif'}}>
      {/* Top bar */}
      <div style={{background:'#fff',borderBottom:'1px solid #e4e4e7',padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <Link href="/dashboard" style={{color:'#a1a1aa',fontSize:13,textDecoration:'none'}}>← Back</Link>
          <div style={{width:1,height:18,background:'#e4e4e7'}}/>
          <div>
            <p style={{fontSize:14,fontWeight:600,color:'#18181b',margin:0}}>{site?.site_name||'WordPress Site'}</p>
            <p style={{fontSize:11,color:'#a1a1aa',margin:0}}>{site?.site_url}</p>
          </div>
          {site?.elementor && <span style={{fontSize:11,background:'#f5f3ff',color:'#7c3aed',padding:'3px 8px',borderRadius:999,fontWeight:500}}>⚡ Elementor</span>}
        </div>
        <div style={{fontSize:12,color:'#71717a',background:'#f4f4f5',padding:'5px 12px',borderRadius:999}}>⚡ {credits} credits</div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:'auto',padding:'24px 0'}}>
        <div style={{maxWidth:720,margin:'0 auto',padding:'0 20px',display:'flex',flexDirection:'column',gap:18}}>
          {messages.map((msg,i) => (
            <div key={i} style={{display:'flex',flexDirection:'column',alignItems:msg.role==='user'?'flex-end':'flex-start'}}>
              <div style={{maxWidth:'82%',background:msg.role==='user'?'#18181b':'#fff',color:msg.role==='user'?'#fff':'#18181b',border:msg.role==='user'?'none':'1px solid #e4e4e7',borderRadius:msg.role==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px',padding:'12px 16px',fontSize:14,lineHeight:1.65,boxShadow:msg.role==='assistant'?'0 1px 4px #0000000a':'none'}}>
                {msg.imagePreview && <img src={msg.imagePreview} alt="" style={{maxWidth:160,borderRadius:8,marginBottom:8,display:'block'}}/>}
                <FmtText text={msg.text} isError={msg.isError}/>
              </div>
              {msg.results?.length>0 && (
                <div style={{marginTop:6,display:'flex',flexDirection:'column',gap:5,maxWidth:'82%'}}>
                  {msg.results.map((r,j) => <ActionCard key={j} result={r}/>)}
                </div>
              )}
              {msg.credits_used && <div style={{fontSize:11,color:'#a1a1aa',marginTop:3}}>Used {msg.credits_used} credits</div>}
            </div>
          ))}
          {sending && (
            <div style={{display:'flex',alignItems:'flex-start'}}>
              <div style={{background:'#fff',border:'1px solid #e4e4e7',borderRadius:'18px 18px 18px 4px',padding:'14px 18px',boxShadow:'0 1px 4px #0000000a'}}>
                <div style={{display:'flex',gap:5}}><span className="dot"/><span className="dot"/><span className="dot"/></div>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
      </div>

      {/* Input */}
      <div style={{background:'#fff',borderTop:'1px solid #e4e4e7',padding:'14px 20px',flexShrink:0}}>
        <div style={{maxWidth:720,margin:'0 auto'}}>
          {imagePreview && (
            <div style={{marginBottom:8,position:'relative',display:'inline-block'}}>
              <img src={imagePreview} alt="" style={{height:56,width:56,objectFit:'cover',borderRadius:8,border:'1px solid #e4e4e7'}}/>
              <button onClick={()=>setImagePreview(null)} style={{position:'absolute',top:-5,right:-5,background:'#18181b',color:'#fff',border:'none',borderRadius:'50%',width:17,height:17,fontSize:9,cursor:'pointer'}}>✕</button>
            </div>
          )}
          <div id="inputbox" style={{display:'flex',alignItems:'flex-end',gap:8,background:'#f9f9f9',border:'1.5px solid #e4e4e7',borderRadius:15,padding:'8px 10px',transition:'border-color 0.2s'}} onFocusCapture={e=>e.currentTarget.style.borderColor='#5271ff'} onBlurCapture={e=>e.currentTarget.style.borderColor='#e4e4e7'}>
            <button onClick={()=>fileRef.current?.click()} title="Add image" style={{background:'none',border:'none',cursor:'pointer',color:'#a1a1aa',padding:4,flexShrink:0,lineHeight:0}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{display:'none'}}/>
            <textarea ref={textRef} value={input} onChange={e=>{setInput(e.target.value);e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,140)+'px'}} onKeyDown={onKey} placeholder="Describe what to build or change..." rows={1} style={{flex:1,background:'transparent',border:'none',outline:'none',resize:'none',fontSize:14,color:'#18181b',fontFamily:'inherit',lineHeight:1.5,maxHeight:140,overflow:'auto',padding:'3px 0'}}/>
            <button onClick={send} disabled={sending||!input.trim()} style={{width:33,height:33,borderRadius:9,border:'none',cursor:input.trim()&&!sending?'pointer':'not-allowed',background:input.trim()&&!sending?'#18181b':'#e4e4e7',color:input.trim()&&!sending?'#fff':'#a1a1aa',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 0.15s'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
            </button>
          </div>
          <p style={{fontSize:11,color:'#a1a1aa',textAlign:'center',marginTop:7}}>AI builds directly on your WordPress site · 5 credits per message</p>
        </div>
      </div>

      {/* Upgrade modal */}
      {showUpgrade && (
        <div style={{position:'fixed',inset:0,background:'#000000aa',zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
          <div style={{background:'#fff',borderRadius:20,padding:28,maxWidth:340,width:'100%',textAlign:'center',boxShadow:'0 25px 60px #00000033'}}>
            <div style={{fontSize:40,marginBottom:12}}>⚡</div>
            <h3 style={{fontSize:18,fontWeight:700,color:'#18181b',marginBottom:6}}>Out of credits</h3>
            <p style={{fontSize:14,color:'#71717a',marginBottom:20,lineHeight:1.5}}>Top up to keep building your WordPress site with AI.</p>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <button style={{width:'100%',background:'#18181b',color:'#fff',border:'none',borderRadius:12,padding:'12px',fontSize:14,fontWeight:500,cursor:'pointer'}}>500 credits — $9</button>
              <button style={{width:'100%',background:'linear-gradient(135deg,#5271ff,#a855f7)',color:'#fff',border:'none',borderRadius:12,padding:'12px',fontSize:14,fontWeight:500,cursor:'pointer'}}>1500 credits — $19 ⭐ Popular</button>
              <button onClick={()=>setShowUpgrade(false)} style={{width:'100%',background:'transparent',color:'#71717a',border:'1px solid #e4e4e7',borderRadius:12,padding:'12px',fontSize:14,cursor:'pointer'}}>Maybe later</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FmtText({ text, isError }) {
  if (!text) return null
  return (
    <div style={{color:isError?'#ef4444':'inherit'}}>
      {text.split('\n').map((line,i) => (
        <p key={i} style={{margin:i>0?'4px 0 0':0}} dangerouslySetInnerHTML={{__html:line.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')||'&nbsp;'}}/>
      ))}
    </div>
  )
}

function ActionCard({ result }) {
  const ok = result.success
  const labels = { create_elementor_page:'📄 Built Elementor page', update_elementor_page:'✏️ Updated Elementor page', create_page:'📄 Created page', update_page:'✏️ Updated page', update_site_option:'⚙️ Updated setting', set_homepage:'🏠 Set homepage', create_menu:'🗂️ Created menu', add_menu_item:'➕ Added menu item', upload_media_from_url:'🖼️ Uploaded image' }
  return (
    <div style={{background:ok?'#f0fdf4':'#fff1f2',border:`1px solid ${ok?'#bbf7d0':'#fecdd3'}`,borderRadius:10,padding:'8px 12px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
      <span style={{fontSize:13,fontWeight:500,color:ok?'#15803d':'#be123c'}}>{ok?'✅':'❌'} {labels[result.action]||result.action}</span>
      {ok && result.data?.url && <a href={result.data.url} target="_blank" rel="noreferrer" style={{fontSize:11,color:'#15803d',textDecoration:'none',borderBottom:'1px solid #86efac'}}>Preview →</a>}
      {!ok && <span style={{fontSize:11,color:'#be123c'}}>{result.error}</span>}
    </div>
  )
}

export default function ChatPage() {
  return <Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#a1a1aa',fontSize:14}}>Loading...</div>}><ChatUI/></Suspense>
}
