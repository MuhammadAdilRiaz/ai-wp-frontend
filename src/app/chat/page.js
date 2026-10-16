'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { getToken, redirectToLogin } from '@/lib/auth'

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
  const [imageData, setImageData] = useState(null)
  const [imageError, setImageError] = useState('')
  const [inspectionOpen, setInspectionOpen] = useState(false)
  const [inspection, setInspection] = useState(null)
  const [inspectionError, setInspectionError] = useState('')
  const [inspecting, setInspecting] = useState(false)
  const [approving, setApproving] = useState('')
  const [showUpgrade, setShowUpgrade]   = useState(false)
  const [loadError, setLoadError]       = useState('')
  const [sessionId, setSessionId]       = useState(null)
  const bottomRef = useRef(null)
  const fileRef   = useRef(null)
  const textRef   = useRef(null)

  useEffect(() => {
    // Two different problems used to share one outcome here. No site id means
    // "go pick a project"; no token means "sign in". Sending both to
    // /dashboard made a genuinely signed-out user ping-pong between pages.
    if (!siteId) { router.replace('/dashboard'); return }

    const token = getToken()
    if (!token) { redirectToLogin(`/chat?site=${siteId}`); return }

    init(token)
  }, [siteId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  async function init(token) {
    try {
      const [sitesData, creditsData, histData] = await Promise.all([
        api.getSites(token), api.getCredits(token), api.getHistory(siteId, token)
      ])
      const found = sitesData.sites?.find(s => s.id === siteId)
      if (!found) { router.push('/dashboard'); return }
      setSite(found); setCredits(creditsData.credits || 0)
      if (histData.session_id) setSessionId(histData.session_id)
      const hist = histData.history || []
      if (hist.length > 0) {
        setMessages(hist.map(h => ({ role:h.role, text:h.content, actions:h.metadata?.actions||[], results:h.metadata?.results||[] })))
      } else {
        setMessages([{ role:'assistant', text:`Hi! I am ready to build your site. **${found.site_name||found.site_url}** is connected${found.elementor?' with Elementor ⚡':''}.\n\nTell me what you want to build!`, actions:[] }])
      }
      const pending = sessionStorage.getItem('pending_prompt')
      if (pending) { sessionStorage.removeItem('pending_prompt'); setInput(pending) }
    } catch (err) {
      // This used to be a bare `catch { router.push('/auth') }`, so ANY
      // failure — a 400 from the history call's wrong query param, a network
      // blip, a 500 — was reported to the user as "you need to log in". Only
      // a real 401 is a sign-out now; everything else is shown as what it is.
      if (err?.status === 401) {
        redirectToLogin(`/chat?site=${siteId}`)
        return
      }
      setLoadError(err?.message || 'Could not load this project. Please try again.')
    }
    finally { setLoading(false) }
  }

  async function send() {
    if (!input.trim() || sending) return
    const token = getToken()
    if (!token) { redirectToLogin(`/chat?site=${siteId}`); return }
    const userMsg = input.trim()
    setInput(''); setImagePreview(null); setImageData(null); setImageError(''); setSending(true)
    setMessages(p => [...p, { role:'user', text:userMsg, imagePreview }])
    const history = messages.slice(-10).map(m => ({ role:m.role, content:m.text }))
    try {
      const data = await api.sendMessage(siteId, userMsg, history, token, sessionId, imageData)
      // Keep every message of this conversation in one sidebar thread.
      if (data.session_id) setSessionId(data.session_id)
      setCredits(data.credits_left || 0)
      setMessages(p => [...p, { role:'assistant', text:data.message, actions:data.actions||[], results:data.action_results||[], credits_used:data.credits_used }])
    } catch(err) {
      // A 401 here means the session really is gone — bounce, don't paste
      // "Error: ..." into the transcript as if the AI said it.
      if (err?.status === 401) { redirectToLogin(`/chat?site=${siteId}`); return }
      if (err?.status === 402) { setShowUpgrade(true) }
      setMessages(p => [...p, { role:'assistant', text: err?.status === 402 ? 'You are out of credits. Please top up to continue.' : `Error: ${err.message}`, actions:[], isError:true }])
    } finally { setSending(false) }
  }

  function onKey(e) { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send() } }
  function onFile(e) {
    const f = e.target.files?.[0]
    if (!f) return
    setImageError('')
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(f.type) || f.size > 8 * 1024 * 1024) {
      setImageError('Choose a JPG, PNG, WebP or GIF image up to 8 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => { setImageData(reader.result); setImagePreview(reader.result) }
    reader.onerror = () => setImageError('Could not read this image.')
    reader.readAsDataURL(f)
    e.target.value = ''
  }

  async function inspectCurrentSite() {
    setInspectionOpen(true); setInspecting(true); setInspectionError('')
    try {
      const data = await api.inspectSite(siteId)
      setInspection(data.context || data)
    } catch (err) { setInspectionError(err.message || 'Inspection failed') }
    finally { setInspecting(false) }
  }

  async function approveAction(action, key) {
    if (!window.confirm(`Approve this WordPress action?\n\n${JSON.stringify(action, null, 2)}`)) return
    setApproving(key)
    try {
      const result = await api.executeConnectorAction(siteId, action)
      setMessages(prev => [...prev, { role:'assistant', text: result.success ? `WordPress confirmed: ${action.action}` : `Action failed: ${result.error || 'Unknown error'}`, actions:[], results:[result] }])
      if (result.success) setInspection(null)
    } catch (err) {
      setMessages(prev => [...prev, { role:'assistant', text:`Action failed: ${err.message}`, isError:true, actions:[] }])
    } finally { setApproving('') }
  }

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#a1a1aa',fontSize:14}}>Loading chat...</div>

  if (loadError) return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12,padding:24,textAlign:'center'}}>
      <p style={{color:'#dc2626',fontSize:14,margin:0}}>{loadError}</p>
      <div style={{display:'flex',gap:8}}>
        <button onClick={()=>window.location.reload()} style={{background:'#18181b',color:'#fff',border:'none',borderRadius:10,padding:'9px 16px',fontSize:13,cursor:'pointer'}}>Try again</button>
        <Link href="/dashboard" style={{border:'1px solid #e4e4e7',borderRadius:10,padding:'9px 16px',fontSize:13,color:'#71717a',textDecoration:'none'}}>Back to dashboard</Link>
      </div>
    </div>
  )

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
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <button onClick={inspectCurrentSite} style={{border:'1px solid #d4d4d8',borderRadius:8,padding:'7px 10px',background:'#fff',cursor:'pointer',fontSize:12}}>Inspect website</button>
          <div style={{fontSize:12,color:'#71717a',background:'#f4f4f5',padding:'5px 12px',borderRadius:999}}>⚡ {credits} credits</div>
        </div>
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
              {msg.actions?.filter(a => a && ['install_plugin','activate_plugin','install_theme','activate_theme','delete_page'].includes(a.action)).map((action,j) => {
                const key = `${i}-${j}`
                return <div key={key} style={{border:'1px solid #fde68a',background:'#fffbeb',borderRadius:12,padding:12,marginTop:8,fontSize:12,maxWidth:'82%'}}>
                  <strong>Approval required: {action.action.replaceAll('_',' ')}</strong>
                  <pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',fontSize:11}}>{JSON.stringify(action,null,2)}</pre>
                  <button disabled={!!approving} onClick={()=>approveAction(action,key)} style={{padding:'7px 12px',borderRadius:8,border:0,background:'#18181b',color:'#fff',cursor:'pointer'}}>{approving===key?'Working...':'Review and approve'}</button>
                </div>
              })}
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
          {imageError && <p style={{fontSize:12,color:'#b91c1c',marginBottom:8}}>{imageError}</p>}
          {imagePreview && (
            <div style={{marginBottom:8,position:'relative',display:'inline-block'}}>
              <img src={imagePreview} alt="" style={{height:56,width:56,objectFit:'cover',borderRadius:8,border:'1px solid #e4e4e7'}}/>
              <button onClick={()=>{setImagePreview(null);setImageData(null)}} style={{position:'absolute',top:-5,right:-5,background:'#18181b',color:'#fff',border:'none',borderRadius:'50%',width:17,height:17,fontSize:9,cursor:'pointer'}}>✕</button>
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

      {inspectionOpen && <div onClick={()=>setInspectionOpen(false)} style={{position:'fixed',inset:0,zIndex:60,background:'#0008',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
        <div onClick={e=>e.stopPropagation()} style={{background:'#fff',borderRadius:18,padding:24,width:'min(650px,95vw)',maxHeight:'80vh',overflowY:'auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h2 style={{fontSize:19}}>WordPress inspection (read-only)</h2><button onClick={()=>setInspectionOpen(false)} style={{border:0,background:'none',cursor:'pointer'}}>✕</button></div>
          {inspecting ? <p>Inspecting WordPress theme, plugins and content...</p> : inspectionError ? <p style={{color:'#b91c1c'}}>{inspectionError}</p> : inspection ? <>
            <p><strong>Site:</strong> {inspection.site_title || site?.site_name}</p>
            <p><strong>Theme:</strong> {typeof inspection.theme==='object' ? inspection.theme?.name : inspection.theme || 'Unknown'}</p>
            <p><strong>Builder:</strong> {inspection.builder || (inspection.elementor?'Elementor':'Unknown')}</p>
            <p><strong>Assessment:</strong> {inspection.classification || 'Not classified'} — no changes have been made.</p>
            <p><strong>Pages:</strong> {inspection.pages?.length ?? 'Unknown'} · <strong>Plugins:</strong> {inspection.plugins?.length ?? 'Unknown'}</p>
            {inspection.plugins && <details><summary>Installed plugins</summary><ul>{inspection.plugins.map((pl,i)=><li key={i}>{pl.name} {pl.active?'(active)':''}</li>)}</ul></details>}
            {inspection.pages && <details><summary>Pages</summary><ul>{inspection.pages.map((pg,i)=><li key={i}>{pg.title}</li>)}</ul></details>}
            <p style={{fontSize:12,color:'#71717a'}}>Existing sites are not automatically modified. Theme/plugin installation requires your approval.</p>
          </> : null}
        </div>
      </div>}
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
