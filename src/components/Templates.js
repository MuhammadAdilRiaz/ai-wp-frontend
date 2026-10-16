'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

const FEATURED_TEMPLATE_CONFIG = [
  {
    slug: 'ai-startup',
    title: '1. AI & SaaS',
    subtitle: 'Gradients, bento grids, animated hero sections',
  },
  {
    slug: 'creative-portfolio',
    title: '2. Creative Agency',
    subtitle: 'Bold typography, portfolio, scroll effects',
  },
  {
    slug: 'online-store',
    title: '3. Ecommerce',
    subtitle: 'Product grids, modern cards, clean shopping experience',
  },
  {
    slug: 'real-estate-agency',
    title: '4. Real Estate',
    subtitle: 'Property listings, search sections, premium visuals',
  },
  {
    slug: 'luxury-restaurant',
    title: '5. Restaurant',
    subtitle: 'Food menu, galleries, booking sections',
  },
  {
    slug: 'it-consultancy',
    title: '6. IT & Software',
    subtitle: 'Service sections, feature cards, testimonials',
  },
]

const previewUrl = (slug) => `/template-previews/${encodeURIComponent(slug)}.png`

export default function Templates({ onSelect }) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    api.getTemplates()
      .then(data => {
        if (!cancelled) setTemplates(data.templates || [])
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Cannot load templates')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  function useTemplate(template) {
    if (!template) return
    const prompt = template.prompt
    sessionStorage.setItem('pending_template_slug', template.slug)
    if (onSelect) {
      onSelect(prompt)
    } else {
      sessionStorage.setItem('pending_prompt', prompt)
      router.push('/auth?next=/chat')
    }
  }

  const templateMap = new Map(templates.map(t => [t.slug, t]))
  const featuredTemplates = FEATURED_TEMPLATE_CONFIG
    .map(item => ({ ...item, template: templateMap.get(item.slug) }))
    .filter(item => item.template)

  return (
    <div style={{ width: '100%', maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: '#18181b', letterSpacing: '-0.03em', marginBottom: 8 }}>
          Start from a real template
        </h2>
        <p style={{ fontSize: 15, color: '#71717a', maxWidth: 700, margin: '0 auto' }}>
          Choose a modern website template preview and use it for free. When you select a template, its prompt is sent into your Elimeni AI chat flow.
        </p>
      </div>

      {loading && <p style={{ textAlign: 'center', color: '#71717a' }}>Loading templates...</p>}
      {error && <p role="alert" style={{ textAlign: 'center', color: '#dc2626' }}>{error}</p>}

      {!loading && !error && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 18,
            alignItems: 'start',
          }}
        >
          {featuredTemplates.map((item, index) => {
            const t = item.template
            return (
              <button
                key={t.slug}
                type="button"
                onClick={() => useTemplate(t)}
                style={{
                  display: 'block',
                  width: '100%',
                  border: 'none',
                  padding: 0,
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    background: '#f5f5f5',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    transition: 'transform .15s ease, box-shadow .15s ease, border-color .15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                    e.currentTarget.style.borderColor = '#d1d5db'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'
                    e.currentTarget.style.borderColor = '#e5e7eb'
                  }}
                >
                  <div style={{ position: 'relative', background: '#f8fafc' }}>
                    <img
                      src={previewUrl(t.slug)}
                      alt={`${t.name} real website template preview`}
                      loading={index < 4 ? 'eager' : 'lazy'}
                      style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '4 / 3', objectFit: 'cover', objectPosition: 'top' }}
                    />
                    <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(17,24,39,0.82)', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '6px 10px' }}>
                      FREE TEMPLATE
                    </span>
                  </div>
                </div>
                <div style={{ paddingTop: 10 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.45 }}>{item.subtitle}</div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
