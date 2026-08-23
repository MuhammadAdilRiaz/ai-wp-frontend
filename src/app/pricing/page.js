'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { api } from '@/lib/api'

// Marketing copy only — price, credits, and trial length all come from
// GET /api/credits/plans (src/lib/plans.js on the backend), never hardcoded
// here. If you change a price or credit allotment, change it in ONE place:
// the backend's src/lib/plans.js, and this page picks it up automatically.
const PLAN_COPY = {
  starter: {
    tagline: 'Get your first WordPress site live with AI',
    features: [
      'Unlimited published WordPress sites',
      'Elementor page generation',
      'Claude + GPT-5.6 model routing',
      'Email support',
    ],
  },
  pro: {
    tagline: 'For builders shipping real client sites',
    highlight: true,
    features: [
      'Everything in Starter',
      'Much higher monthly credit ceiling',
      'Priority processing',
      'Priority email support',
    ],
  },
  business: {
    tagline: 'Highest capacity, best model for complex builds',
    features: [
      'Everything in Pro',
      'Claude Opus for complex page builds',
      'Highest monthly credit ceiling',
      'Priority support',
    ],
  },
}
const PLAN_ORDER = ['starter', 'pro', 'business']

const FAQS = [
  {
    q: 'What is AI WP Builder and how does it work?',
    a: 'AI WP Builder lets you build real WordPress sites by chatting with AI. Describe what you want and it generates live Elementor pages instantly.',
  },
  {
    q: 'What is a credit?',
    a: 'A credit is used each time you send the AI a message that reads or changes your site — the exact amount depends on how much work the message takes.',
  },
  {
    q: 'Do I need a credit card to try it?',
    a: 'No — every account starts with a 7-day free trial, no card required. Pick a plan any time during or after your trial to keep building.',
  },
  {
    q: 'Do credits roll over?',
    a: "No. Your plan's credit allotment resets at the start of each billing cycle — unused credits don't carry over.",
  },
  {
    q: 'What happens to my credits if my subscription ends?',
    a: 'Once a subscription ends, remaining credits are cleared and you\'ll need to resubscribe to keep building.',
  },
  {
    q: 'Who owns the projects and code?',
    a: 'You do. Every site you build is fully yours to export, host, and modify however you like.',
  },
]

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2"
      style={{ flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(-90deg)' : 'rotate(90deg)' }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export default function PricingPage() {
  const router = useRouter()
  const [yearly, setYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [catalog, setCatalog] = useState(null)   // GET /api/credits/plans
  const [billing, setBilling] = useState(null)   // GET /api/credits — only if logged in
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [checkingOutPlan, setCheckingOutPlan] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const plansRes = await api.getPlans()
        if (cancelled) return
        setCatalog(plansRes)

        const token = typeof window !== 'undefined' ? localStorage.getItem('aiwpb_token') : null
        if (token) {
          try {
            const creditsRes = await api.getCredits(token)
            if (!cancelled) setBilling(creditsRes)
          } catch { /* not logged in or session expired — pricing page still works logged-out */ }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load pricing.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  async function handleChoosePlan(planId) {
    const token = localStorage.getItem('aiwpb_token')
    if (!token) {
      router.push('/auth?next=/pricing')
      return
    }
    setCheckingOutPlan(planId)
    setError('')
    try {
      const { url } = await api.checkout(planId, yearly ? 'yearly' : 'monthly', token)
      window.location.href = url
    } catch (err) {
      setError(err.message || 'Could not start checkout. Please try again.')
      setCheckingOutPlan(null)
    }
  }

  const currentPlan = billing?.plan
  const hasActiveSubscription = ['starter', 'pro', 'business'].includes(currentPlan) && billing?.billing_status !== 'cancelled'
  const plans = catalog?.plans
    ? PLAN_ORDER.map(id => catalog.plans.find(p => p.id === id)).filter(Boolean)
    : []

  return (
    <main>
      <Navbar />

      {/* Header */}
      <section style={{ textAlign: 'center', padding: '48px 24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg, #f97316, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#18181b', letterSpacing: '-0.02em', margin: 0 }}>
            Pricing
          </h1>
        </div>
        <p style={{ marginTop: 12, color: '#52525b', fontSize: 16 }}>
          {catalog?.trial
            ? `Every plan starts with a ${catalog.trial.days}-day free trial. No credit card required.`
            : 'Pick the plan that matches your workflow.'}
        </p>

        {/* Toggle */}
        <div style={{
          marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 4,
          background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: 999, padding: 4,
        }}>
          <button
            onClick={() => setYearly(false)}
            style={{
              padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600,
              background: !yearly ? '#fff' : 'transparent',
              color: !yearly ? '#18181b' : '#71717a',
              boxShadow: !yearly ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            style={{
              padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600,
              background: yearly ? '#fff' : 'transparent',
              color: yearly ? '#18181b' : '#71717a',
              boxShadow: yearly ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            Yearly
            <span style={{ color: '#a855f7', fontWeight: 700 }}>save $48/yr</span>
          </button>
        </div>
      </section>

      {error && (
        <div style={{ maxWidth: 480, margin: '0 auto 24px', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#991b1b', fontSize: 13, textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* Plan cards */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 40px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#71717a', fontSize: 14 }}>Loading plans...</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}>
            {plans.map(plan => {
              const copy = PLAN_COPY[plan.id] || {}
              const isCurrent = currentPlan === plan.id && billing?.billing_status !== 'cancelled'
              const priceToShow = yearly ? plan.annual_monthly_equivalent_usd : plan.monthly_price_usd
              const isCheckingOut = checkingOutPlan === plan.id

              let ctaLabel = `Choose ${plan.label}`
              let ctaAction = () => handleChoosePlan(plan.id)
              let ctaDisabled = false

              if (isCurrent) {
                ctaLabel = 'Current plan'
                ctaDisabled = true
              } else if (hasActiveSubscription) {
                // Already on a different paid plan — send to the Stripe
                // portal for proration instead of starting a second
                // subscription through Checkout.
                ctaLabel = 'Manage billing to switch'
                ctaAction = () => router.push('/account')
              } else if (isCheckingOut) {
                ctaLabel = 'Redirecting…'
                ctaDisabled = true
              }

              return (
                <div
                  key={plan.id}
                  style={{
                    border: copy.highlight ? '2px solid #a855f7' : '1px solid #e4e4e7',
                    borderRadius: 16,
                    padding: 24,
                    background: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  {copy.highlight && (
                    <span style={{
                      position: 'absolute', top: -12, left: 24,
                      background: '#a855f7', color: '#fff', fontSize: 12, fontWeight: 700,
                      padding: '4px 10px', borderRadius: 999,
                    }}>
                      Most popular
                    </span>
                  )}

                  <h3 style={{ fontSize: 19, fontWeight: 700, color: '#18181b', margin: 0 }}>{plan.label}</h3>
                  <p style={{ fontSize: 13, color: '#71717a', marginTop: 6, minHeight: 34 }}>{copy.tagline}</p>

                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 34, fontWeight: 700, color: '#18181b', letterSpacing: '-0.02em' }}>
                      ${priceToShow}
                    </span>
                    <span style={{ fontSize: 13, color: '#71717a' }}>/ month</span>
                  </div>
                  {yearly && (
                    <p style={{ fontSize: 12, color: '#a1a1aa', margin: '2px 0 0' }}>
                      billed ${plan.annual_price_usd}/yr
                    </p>
                  )}

                  <div style={{
                    marginTop: 12, fontSize: 13, color: '#3f3f46',
                    background: '#f4f4f5', borderRadius: 8, padding: '8px 12px',
                  }}>
                    {plan.display_credits_monthly.toLocaleString()} monthly AI credits
                  </div>

                  <button
                    onClick={ctaAction}
                    disabled={ctaDisabled}
                    style={{
                      marginTop: 18,
                      padding: '11px 0',
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: ctaDisabled ? 'default' : 'pointer',
                      border: copy.highlight && !isCurrent ? 'none' : '1px solid #d4d4d8',
                      background: isCurrent ? '#f4f4f5' : (copy.highlight ? '#a855f7' : '#fff'),
                      color: isCurrent ? '#71717a' : (copy.highlight ? '#fff' : '#18181b'),
                      opacity: ctaDisabled && !isCurrent ? 0.6 : 1,
                    }}
                  >
                    {ctaLabel}
                  </button>

                  <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(copy.features || []).map(f => (
                      <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13.5, color: '#3f3f46' }}>
                        <CheckIcon />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#18181b', textAlign: 'center', marginBottom: 32 }}>
          Frequently asked questions
        </h2>
        <div>
          {FAQS.map((item, i) => {
            const open = openFaq === i
            return (
              <div key={item.q} style={{ borderBottom: '1px solid #e4e4e7' }}>
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#18181b' }}>{item.q}</span>
                  <ChevronIcon open={open} />
                </button>
                {open && (
                  <p style={{ fontSize: 14, color: '#52525b', paddingBottom: 18, margin: 0, lineHeight: 1.6 }}>
                    {item.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <Footer />
    </main>
  )
}
