'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'

export default function Dashboard() {
  const router = useRouter()
  const [sites, setSites]         = useState([])
  const [credits, setCredits]     = useState(0)
  const [user, setUser]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [siteUrl, setSiteUrl]     = useState('')
  const [siteToken, setSiteToken] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [connErr, setConnErr]     = useState('')

  useEffect(() => {
    const token = localStorage.getItem('aiwpb_token')
    if (!token) { router.push('/auth'); return }
    loadData(token)
  }, [])

  async function loadData(token) {
    try {
      const [me, s, c] = await Promise.all([api.me(token), api.getSites(token), api.getCredits(token)])
      setUser(me.user); setSites(s.sites||[]); setCredits(c.credits||0)
    } catch { router.push('/auth') }
    finally { setLoading(false) }
  }

  async function connect(e) {
    e.preventDefault(); setConnErr(''); setConnecting(true)
    const token = localStorage.getItem('aiwpb_token')
    try {
      const d = await api.connectSite(siteUrl, siteToken, token)
      setSites(p=>[d.site,...p]); setShowModal(false); setSiteUrl(''); setSiteToken('')
    } catch(err) { setConnErr(err.message) }
    finally { setConnecting(false) }
  }

  async function removeSite(id) {
    if(!confirm('Disconnect this site?')) return
    const token = localStorage.getItem('aiwpb_token')
    await api.deleteSite(id, token)
    setSites(p=>p.filter(s=>s.id!==id))
  }

  function logout() { localStorage.clear(); router.push('/') }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="text-zinc-400 text-sm">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Nav */}
      <nav className="bg-white border-b border-zinc-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900">
          <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,#5271ff,#a855f7)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          AI WP Builder
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-zinc-900 text-white text-xs font-medium px-3 py-1.5 rounded-full">
            ⚡ {credits} credits
          </div>
          <span className="text-xs text-zinc-400">{user?.email}</span>
          <button onClick={logout} className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors border border-zinc-200 px-3 py-1.5 rounded-lg">Log out</button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Your sites</h1>
            <p className="text-sm text-zinc-500 mt-1">Connect a WordPress site to start building</p>
          </div>
          <button onClick={()=>setShowModal(true)} className="flex items-center gap-2 bg-zinc-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors">
            + Connect site
          </button>
        </div>

        {/* Sites */}
        {sites.length===0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-zinc-200">
            <div className="text-4xl mb-3">🌐</div>
            <p className="font-medium text-zinc-600">No sites connected yet</p>
            <p className="text-sm text-zinc-400 mt-1 mb-5">Install the plugin on your WordPress site, then connect it here</p>
            <button onClick={()=>setShowModal(true)} className="text-sm text-blue-600 font-medium hover:underline">+ Connect your first site</button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sites.map(site=>(
              <div key={site.id} className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center justify-between hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div style={{width:42,height:42,borderRadius:12,background:'linear-gradient(135deg,#eff6ff,#faf5ff)',border:'1px solid #e0e7ff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>🌐</div>
                  <div>
                    <p className="font-semibold text-zinc-900">{site.site_name||'WordPress Site'}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{site.site_url}</p>
                    {site.elementor && <span className="inline-block text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full mt-1 font-medium">⚡ Elementor</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>removeSite(site.id)} className="text-zinc-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-xs border border-zinc-200 px-2 py-1 rounded-lg">Remove</button>
                  <button onClick={()=>router.push(`/chat?site=${site.id}`)} className="flex items-center gap-1.5 bg-zinc-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-zinc-700 transition-colors">
                    Open chat →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Credits card */}
        <div className="mt-8 rounded-2xl p-5 flex items-center justify-between" style={{background:'linear-gradient(135deg,#eff6ff,#faf5ff)',border:'1px solid #e0e7ff'}}>
          <div>
            <p className="font-semibold text-zinc-900">{credits} credits remaining</p>
            <p className="text-sm text-zinc-500 mt-0.5">Each chat message costs 5 credits</p>
          </div>
          <button className="flex items-center gap-2 bg-zinc-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-zinc-700 transition-colors">
            💳 Buy credits
          </button>
        </div>
      </div>

      {/* Connect modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e=>{if(e.target===e.currentTarget)setShowModal(false)}}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" style={{animation:'msgIn 0.2s ease'}}>
            <h3 className="font-semibold text-zinc-900 text-lg mb-1">Connect WordPress site</h3>
            <p className="text-sm text-zinc-500 mb-5">Install the AI WP Builder plugin on your site, then copy the token from plugin Settings page.</p>
            <form onSubmit={connect} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-600 mb-1 block">WordPress Site URL</label>
                <input type="url" value={siteUrl} onChange={e=>setSiteUrl(e.target.value)} placeholder="https://yoursite.com" required className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"/>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-600 mb-1 block">Site Token</label>
                <input type="text" value={siteToken} onChange={e=>setSiteToken(e.target.value)} placeholder="Paste from plugin Settings page" required className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all font-mono text-xs"/>
              </div>
              {connErr && <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{connErr}</div>}
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={()=>setShowModal(false)} className="flex-1 border border-zinc-200 text-zinc-700 text-sm font-medium py-2.5 rounded-xl hover:bg-zinc-50 transition-colors">Cancel</button>
                <button type="submit" disabled={connecting} className="flex-1 bg-zinc-900 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-zinc-700 transition-colors disabled:bg-zinc-300">
                  {connecting?'Connecting...':'Connect site'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
