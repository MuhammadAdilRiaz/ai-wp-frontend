'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { api } from '@/lib/api'

const PLAN_LABELS = { trial: 'Trial', starter: 'Starter', pro: 'Pro', business: 'Business', cancelled: 'Cancelled' }

function daysLeft(isoDate) {
  if (!isoDate) return null
  const ms = new Date(isoDate).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)))
}

const card = { border:'1px solid #e4e4e7', borderRadius:12, background:'#fff', padding:20, marginBottom:16 }
const label = { fontSize:13, fontWeight:600, color:'#18181b', margin:0 }
const sub = { fontSize:12.5, color:'#71717a', margin:'2px 0 0' }
const row = { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid #f0f0f0' }
const btn = { padding:'8px 16px', borderRadius:8, border:'1px solid #d4d4d8', background:'#fff', color:'#18181b', fontSize:13, fontWeight:600, cursor:'pointer' }
const btnPrimary = { ...btn, border:'none', background:'#18181b', color:'#fff' }

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [billing, setBilling] = useState(null)
  const [planCatalog, setPlanCatalog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('aiwpb_token')
    if (!token) { router.replace('/auth?next=/account'); return }

    let cancelled = false
    async function load() {
      try {
        const [meRes, creditsRes, plansRes] = await Promise.all([
          api.me(token), api.getCredits(token), api.getPlans(),
        ])
        if (cancelled) return
        const u = meRes.user || meRes
        setUser({
          name: u.name || u.email?.split('@')[0] || 'there',
          email: u.email,
          initial: (u.name || u.email || '?')[0].toUpperCase(),
          created_at: meRes.profile?.created_at || u.created_at,
        })
        setBilling(creditsRes)
        setPlanCatalog(plansRes)
      } catch (err) {
        if (cancelled) return
        const msg = err.message || ''
        if (msg.includes('401') || /unauthor/i.test(msg)) {
          localStorage.removeItem('aiwpb_token'); localStorage.removeItem('aiwpb_user')
          router.replace('/auth?next=/account'); return
        }
        setError(msg || 'Failed to load account settings')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [router])

  async function openBillingPortal() {
    const token = localStorage.getItem('aiwpb_token')
    setPortalLoading(true)
    try {
      const { url } = await api.billingPortal(token)
      window.location.href = url
    } catch (err) {
      setError(err.message || 'Could not open billing portal')
      setPortalLoading(false)
    }
  }

  if (loading) {
    return <div style={{ display:'flex', minHeight:'100vh', alignItems:'center', justifyContent:'center', color:'#71717a', fontSize:14 }}>Loading account settings...</div>
  }
  if (error) {
    return <div style={{ display:'flex', minHeight:'100vh', alignItems:'center', justifyContent:'center', color:'#dc2626', fontSize:14 }}>{error}</div>
  }

  const plan = billing?.plan
  const planLabel = PLAN_LABELS[plan] || plan
  const planInfo = planCatalog?.plans?.find(p => p.id === plan)
  const monthlyAllotment = plan === 'trial'
    ? planCatalog?.trial?.display_credits
    : planInfo?.display_credits_monthly
  const usedPct = monthlyAllotment ? Math.min(100, Math.round((1 - billing.credits / monthlyAllotment) * 100)) : null
  const left = plan === 'trial' ? daysLeft(billing.trial_ends_at) : null
  const canManageBilling = !!billing?.billing_cycle && plan !== 'trial' // has been through checkout at least once
  const isPaidActive = ['starter','pro','business'].includes(plan)

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#fafafa' }}>
      <Sidebar user={user} billing={billing} />
      <main style={{ flex:1, minWidth:0, padding:'32px 40px', maxWidth:720 }}>
        <button onClick={() => router.push('/dashboard')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:'#71717a', fontSize:13, fontWeight:500, padding:0, marginBottom:20 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Go back
        </button>

        <h1 style={{ fontSize:22, fontWeight:700, color:'#18181b', margin:'0 0 4px' }}>Account settings</h1>
        <p style={{ fontSize:13.5, color:'#71717a', margin:'0 0 28px' }}>Manage your profile, plan, and billing.</p>

        {/* ── Profile ─────────────────────────────────────────────────────── */}
        <div style={card}>
          <p style={label}>Profile</p>
          <p style={sub}>Your account details.</p>
          <div style={row}>
            <div>
              <p style={{ ...label, fontSize:13 }}>Avatar</p>
              <p style={sub}>Generated from your email.</p>
            </div>
            <div style={{ width:40, height:40, borderRadius:'50%', background:'#dbeafe', color:'#1d4ed8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700 }}>
              {user.initial}
            </div>
          </div>
          <div style={row}>
            <div>
              <p style={{ ...label, fontSize:13 }}>Email</p>
              <p style={sub}>Used to sign in and for billing receipts.</p>
            </div>
            <span style={{ fontSize:13, color:'#3f3f46' }}>{user.email}</span>
          </div>
          {user.created_at && (
            <div style={row}>
              <div>
                <p style={{ ...label, fontSize:13 }}>Member since</p>
              </div>
              <span style={{ fontSize:13, color:'#3f3f46' }}>{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* ── Plan & billing ──────────────────────────────────────────────── */}
        <div style={card}>
          <p style={label}>Plan & billing</p>
          <p style={sub}>Your current plan and credit usage.</p>

          {billing?.billing_status === 'past_due' && (
            <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'10px 12px', margin:'14px 0 0', fontSize:12.5, color:'#991b1b' }}>
              Your last payment failed. Update your card to avoid losing access.
            </div>
          )}

          <div style={row}>
            <div>
              <p style={{ ...label, fontSize:13 }}>Current plan</p>
              {plan === 'trial' && (
                <p style={sub}>{left === 0 ? 'Trial ends today' : `${left} day${left === 1 ? '' : 's'} left`}</p>
              )}
              {plan === 'cancelled' && <p style={{ ...sub, color:'#b91c1c' }}>Subscription ended</p>}
              {isPaidActive && <p style={sub}>Billed {billing.billing_cycle}</p>}
            </div>
            {(plan === 'trial' || plan === 'cancelled') ? (
              <button onClick={() => router.push('/pricing')} style={btnPrimary}>
                {plan === 'trial' ? 'Choose a plan' : 'Resubscribe'}
              </button>
            ) : (
              <span style={{ fontSize:13, fontWeight:600, color:'#18181b' }}>{planLabel}</span>
            )}
          </div>

          {monthlyAllotment != null && (
            <div style={row}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <p style={{ ...label, fontSize:13 }}>Credits this cycle</p>
                  <span style={{ fontSize:12.5, color:'#71717a' }}>{billing.credits.toLocaleString()} / {monthlyAllotment.toLocaleString()}</span>
                </div>
                <div style={{ height:6, borderRadius:999, background:'#f0f0f0', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${usedPct}%`, borderRadius:999, background: usedPct >= 80 ? '#f97316' : '#18181b' }}/>
                </div>
              </div>
            </div>
          )}

          {canManageBilling && (
            <div style={row}>
              <div>
                <p style={{ ...label, fontSize:13 }}>Manage billing</p>
                <p style={sub}>Update your card, switch monthly/yearly, or cancel.</p>
              </div>
              <button onClick={openBillingPortal} disabled={portalLoading} style={btn}>
                {portalLoading ? 'Opening…' : 'Manage billing'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
