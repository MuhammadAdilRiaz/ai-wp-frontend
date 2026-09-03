'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

const GRADIENTS = [
  'linear-gradient(135deg,#18181b,#3f3f46)',
  'linear-gradient(135deg,#7c3aed,#ec4899)',
  'linear-gradient(135deg,#0ea5e9,#22c55e)',
  'linear-gradient(135deg,#f97316,#ef4444)',
  'linear-gradient(135deg,#0f172a,#334155)',
]
function gradientFor(seed) {
  let h = 0
  for (const ch of seed || '') h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return GRADIENTS[h % GRADIENTS.length]
}

function timeAgo(iso) {
  if (!iso) return ''
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60); if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`
  const h = Math.floor(m / 60); if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`
  const d = Math.floor(h / 24); if (d < 30) return `${d} day${d === 1 ? '' : 's'} ago`
  const mo = Math.floor(d / 30); if (mo < 12) return `${mo} month${mo === 1 ? '' : 's'} ago`
  return `${Math.floor(mo / 12)} year${Math.floor(mo / 12) === 1 ? '' : 's'} ago`
}

export default function ProjectsGrid({ sites = [], sitesLoading = false, onAddSiteClick, onSitesChange, filter = null }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [starringId, setStarringId] = useState(null)

  const filtered = useMemo(() => {
    let list = sites
    if (filter === 'starred') list = list.filter(s => s.starred)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(s => (s.site_name || '').toLowerCase().includes(q) || (s.site_url || '').toLowerCase().includes(q))
    }
    return list
  }, [sites, filter, search])

  async function toggleStar(site, e) {
    e.stopPropagation()
    setStarringId(site.id)
    try {
      const token = localStorage.getItem('aiwpb_token')
      await api.starSite(site.id, !site.starred, token)
      onSitesChange(sites.map(s => s.id === site.id ? { ...s, starred: !s.starred } : s))
    } catch {
      // best-effort — leave the star as it was if the request fails
    } finally {
      setStarringId(null)
    }
  }

  return (
    <section style={{ width:'100%', maxWidth:960, margin:'0 auto', padding:'0 24px 60px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:'1px solid #e4e4e7', borderRadius:999, padding:'6px 14px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects"
            style={{ border:'none', outline:'none', fontSize:13, width:180, fontFamily:'inherit' }}
          />
        </div>
        <span style={{ fontSize:13, fontWeight:600, color:'#18181b', background:'#f4f4f5', borderRadius:999, padding:'6px 14px' }}>
          {filter === 'starred' ? 'Starred' : 'My projects'}
        </span>
      </div>

      {sitesLoading && <p style={{ fontSize:13.5, color:'#a1a1aa' }}>Loading projects...</p>}

      {!sitesLoading && filtered.length === 0 && (
        <div style={{ border:'1px dashed #d4d4d8', borderRadius:16, padding:'48px 24px', textAlign:'center' }}>
          {filter === 'starred' ? (
            <>
              <p style={{ fontSize:14, fontWeight:600, color:'#18181b', margin:'0 0 4px' }}>No starred projects yet</p>
              <p style={{ fontSize:13, color:'#71717a', margin:0 }}>Click the star on any project to pin it here.</p>
            </>
          ) : sites.length === 0 ? (
            <>
              <p style={{ fontSize:14, fontWeight:600, color:'#18181b', margin:'0 0 4px' }}>No projects yet</p>
              <p style={{ fontSize:13, color:'#71717a', margin:'0 0 16px' }}>Connect your WordPress site to start building.</p>
              <button onClick={onAddSiteClick} style={{ padding:'9px 18px', borderRadius:8, border:'none', background:'#18181b', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                Add your website
              </button>
            </>
          ) : (
            <p style={{ fontSize:13.5, color:'#71717a', margin:0 }}>No projects match "{search}"</p>
          )}
        </div>
      )}

      {!sitesLoading && filtered.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:16 }}>
          {filtered.map(site => (
            <div
              key={site.id}
              onClick={() => router.push(`/dashboard/chat?site=${site.id}`)}
              style={{ borderRadius:14, border:'1px solid #e4e4e7', overflow:'hidden', background:'#fff', cursor:'pointer' }}
            >
              <div style={{ height:110, background:gradientFor(site.site_name || site.site_url), position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20z"/>
                </svg>
                {site.connected && (
                  <span style={{ position:'absolute', top:10, left:10, display:'flex', alignItems:'center', gap:5, background:'rgba(0,0,0,0.5)', color:'#fff', fontSize:10.5, fontWeight:600, padding:'3px 8px', borderRadius:999 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e' }}/> Connected
                  </span>
                )}
                <button
                  onClick={e => toggleStar(site, e)}
                  disabled={starringId === site.id}
                  title={site.starred ? 'Unstar' : 'Star this project'}
                  style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.4)', border:'none', borderRadius:8, width:26, height:26, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color: site.starred ? '#facc15' : '#fff' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={site.starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9"/>
                  </svg>
                </button>
              </div>
              <div style={{ padding:'10px 12px' }}>
                <p style={{ fontSize:13.5, fontWeight:600, color:'#18181b', margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {site.site_name || site.site_url}
                </p>
                <p style={{ fontSize:11.5, color:'#a1a1aa', margin:0 }}>
                  {site.elementor ? 'Elementor · ' : ''}Updated {timeAgo(site.updated_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
