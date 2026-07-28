'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const PLANS = [
  {
    name: 'Free',
    tagline: 'Discover what AI WP Builder can do for you',
    monthly: 0,
    yearly: 0,
    cta: 'Get started',
    ctaStyle: 'outline',
    note: 'No credit card needed',
    credits: '10 monthly AI credits',
    features: [
      'Workspace-private projects',
      'Unlimited collaborators',
      '1 published WordPress site',
      'Elementor page generation',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    tagline: 'Designed for builders shipping real sites',
    monthly: 25,
    yearly: 20,
    cta: 'Get started',
    ctaStyle: 'filled',
    highlight: true,
    credits: '100 monthly AI credits',
    features: [
      'All Free features',
      'Credit rollovers',
      'On-demand credit top-ups',
      'Unlimited published sites',
      'Custom domains',
      'Remove the AI WP Builder badge',
      'Email support',
    ],
  },
  {
    name: 'Business',
    tagline: 'Advanced controls for growing teams',
    monthly: 50,
    yearly: 40,
    cta: 'Get started',
    ctaStyle: 'outline',
    credits: '250 monthly AI credits',
    features: [
      'All Pro features',
      'Team workspace',
      'Role-based access',
      'Internal publish',
      'Security center',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    tagline: 'Built for agencies needing scale & governance',
    monthly: null,
    yearly: null,
    cta: 'Book a demo',
    ctaStyle: 'outline',
    credits: 'Volume based pricing',
    features: [
      'All Business features',
      'Volume-based credit pricing',
      'Dedicated support',
      'Onboarding services',
      'White-label sites',
      'Audit logs',
    ],
  },
]

const FAQS = [
  {
    q: 'What is AI WP Builder and how does it work?',
    a: 'AI WP Builder lets you build real WordPress sites by chatting with AI. Describe what you want and it generates live Elementor pages instantly.',
  },
  {
    q: 'What is a credit?',
    a: 'A credit is used each time you ask the AI to generate or modify a page, section, or design element on your site.',
  },
  {
    q: 'Do credits expire?',
    a: 'Monthly credits reset each billing cycle. On the Pro plan, unused credits roll over for up to one month.',
  },
  {
    q: 'What happens to my credits if my subscription ends?',
    a: 'Any unused credits expire at the end of your current billing period once your subscription ends.',
  },
  {
    q: 'Do you charge per seat or per user?',
    a: 'No. Pro, Business, and Enterprise plans include unlimited team members at no extra cost.',
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
  const [yearly, setYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

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
          Start for free. Upgrade to get the AI capacity that matches your workflow.
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
            <span style={{ color: '#a855f7', fontWeight: 700 }}>2 months free</span>
          </button>
        </div>
      </section>

      {/* Plan cards */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {PLANS.map(plan => (
            <div
              key={plan.name}
              style={{
                border: plan.highlight ? '2px solid #a855f7' : '1px solid #e4e4e7',
                borderRadius: 16,
                padding: 24,
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {plan.highlight && (
                <span style={{
                  position: 'absolute', top: -12, left: 24,
                  background: '#a855f7', color: '#fff', fontSize: 12, fontWeight: 700,
                  padding: '4px 10px', borderRadius: 999,
                }}>
                  Most popular
                </span>
              )}

              <h3 style={{ fontSize: 19, fontWeight: 700, color: '#18181b', margin: 0 }}>{plan.name}</h3>
              <p style={{ fontSize: 13, color: '#71717a', marginTop: 6, minHeight: 34 }}>{plan.tagline}</p>

              <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                {plan.monthly === null ? (
                  <span style={{ fontSize: 26, fontWeight: 700, color: '#18181b' }}>Platform fee</span>
                ) : (
                  <>
                    <span style={{ fontSize: 34, fontWeight: 700, color: '#18181b', letterSpacing: '-0.02em' }}>
                      ${yearly ? plan.yearly : plan.monthly}
                    </span>
                    <span style={{ fontSize: 13, color: '#71717a' }}>/ month</span>
                  </>
                )}
              </div>

              <div style={{
                marginTop: 12, fontSize: 13, color: '#3f3f46',
                background: '#f4f4f5', borderRadius: 8, padding: '8px 12px',
              }}>
                {plan.credits}
              </div>

              <button style={{
                marginTop: 18,
                padding: '11px 0',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                border: plan.ctaStyle === 'filled' ? 'none' : '1px solid #d4d4d8',
                background: plan.ctaStyle === 'filled' ? '#a855f7' : '#fff',
                color: plan.ctaStyle === 'filled' ? '#fff' : '#18181b',
              }}>
                {plan.cta}
              </button>

              <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13.5, color: '#3f3f46' }}>
                    <CheckIcon />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security banner */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px 56px' }}>
        <div style={{
          border: '1px solid #e4e4e7', borderRadius: 16, padding: '24px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#18181b', margin: 0 }}>Security and compliance</h4>
            <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
              Enterprise-grade security and compliance for every site you build.
            </p>
          </div>
          <button style={{
            padding: '10px 20px', borderRadius: 10, border: '1px solid #d4d4d8',
            background: '#fff', fontSize: 14, fontWeight: 600, color: '#18181b', cursor: 'pointer',
          }}>
            Learn more
          </button>
        </div>
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
