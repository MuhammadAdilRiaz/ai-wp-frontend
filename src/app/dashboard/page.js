'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import DashboardHero from '@/components/DashboardHero'
import ProjectsGrid from '@/components/ProjectsGrid'
import AddWebsiteModal from '@/components/AddWebsiteModal'
import { api } from '@/lib/api'
import { getToken, clearSession, redirectToLogin } from '@/lib/auth'

function DashboardInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter') // 'starred' | null

  const [user, setUser] = useState(null)
  const [credits, setCredits] = useState(0)
  const [billing, setBilling] = useState(null)
  const [sites, setSites] = useState([])
  const [sitesLoading, setSitesLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // getToken() returns null once the 7-day cap is up, so an expired
    // session is caught here instead of after three failed API calls.
    const token = getToken()
    if (!token) {
      redirectToLogin('/dashboard')
      return
    }

    let cancelled = false

    async function load() {
      try {
        const [meRes, creditsRes, sitesRes] = await Promise.all([
          api.me(token),
          api.getCredits(token),
          api.getSites(token),
        ])
        if (cancelled) return

        const u = meRes.user || meRes
        const storedName = meRes.profile?.name || ''
        setUser({
          name: storedName || u.email?.split('@')[0] || 'there',
          email: u.email,
          initial: (storedName || u.email || '?')[0].toUpperCase(),
        })
        setCredits(creditsRes.credits ?? creditsRes.balance ?? 0)
        setBilling(creditsRes)
        setSites(sitesRes.sites || [])

        // keep the cached copy fresh for anything else reading aiwpb_user
        localStorage.setItem('aiwpb_user', JSON.stringify(u))
      } catch (err) {
        if (cancelled) return
        // Was sniffing for the string "401" inside the message, which meant a
        // 500 mentioning 401 signed you out and a real 401 that didn't spell
        // it out did not. The status code is the fact; use it.
        if (err?.status === 401) {
          clearSession()
          redirectToLogin('/dashboard')
          return
        }
        setError(err?.message || 'Failed to load dashboard')
      } finally {
        if (!cancelled) { setLoading(false); setSitesLoading(false) }
      }
    }

    load()
    return () => { cancelled = true }
  }, [router])

  function handleSiteConnected(site) {
    setSites(prev => [site, ...prev.filter(s => s.id !== site.id)])
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', color: '#71717a', fontSize: 14 }}>
        Loading your dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', color: '#dc2626', fontSize: 14 }}>
        {error}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        user={user}
        billing={billing}
        sites={sites}
        sitesLoading={sitesLoading}
        onAddSiteClick={() => setShowAddModal(true)}
      />
      <main style={{ flex: 1, minWidth: 0, background: '#fafafa' }}>
        <DashboardHero user={user} credits={credits} sites={sites} onAddSiteClick={() => setShowAddModal(true)} />
        <ProjectsGrid
          sites={sites}
          sitesLoading={sitesLoading}
          onAddSiteClick={() => setShowAddModal(true)}
          onSitesChange={setSites}
          filter={filter}
        />
      </main>
      {showAddModal && (
        <AddWebsiteModal
          onClose={() => setShowAddModal(false)}
          onConnected={handleSiteConnected}
        />
      )}
    </div>
  )
}

export default function DashboardPage() {
  // Sidebar reads the URL's ?filter= param (useSearchParams), which Next.js
  // requires to be wrapped in Suspense even in a fully client-rendered page.
  return (
    <Suspense fallback={null}>
      <DashboardInner />
    </Suspense>
  )
}
