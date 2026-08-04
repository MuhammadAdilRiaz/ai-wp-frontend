'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import DashboardHero from '@/components/DashboardHero'
import { api } from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('aiwpb_token')
    if (!token) {
      router.replace('/auth?next=/dashboard')
      return
    }

    let cancelled = false

    async function load() {
      try {
        const [meRes, creditsRes] = await Promise.all([
          api.me(token),
          api.getCredits(token),
        ])
        if (cancelled) return

        const u = meRes.user || meRes
        setUser({
          name: u.name || u.email?.split('@')[0] || 'there',
          email: u.email,
          initial: (u.name || u.email || '?')[0].toUpperCase(),
        })
        setCredits(creditsRes.credits ?? creditsRes.balance ?? 0)

        // keep the cached copy fresh for anything else reading aiwpb_user
        localStorage.setItem('aiwpb_user', JSON.stringify(u))
      } catch (err) {
        if (cancelled) return
        const msg = err.message || ''
        if (msg.includes('401') || /unauthor/i.test(msg)) {
          localStorage.removeItem('aiwpb_token')
          localStorage.removeItem('aiwpb_user')
          router.replace('/auth?next=/dashboard')
          return
        }
        setError(msg || 'Failed to load dashboard')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [router])

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
      <Sidebar user={user} />
      <main style={{ flex: 1, minWidth: 0 }}>
        <DashboardHero user={user} credits={credits} />
      </main>
    </div>
  )
}