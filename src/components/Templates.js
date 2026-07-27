'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TEMPLATES = [
  { cat:'business',   emoji:'🏢', name:'Agency homepage',      desc:'Hero, services, team, contact',        prompt:'Build an agency homepage with hero, services grid, team section and contact form' },
  { cat:'restaurant', emoji:'🍽️', name:'Luxury restaurant',    desc:'Elegant dark design with menu',        prompt:'Build an elegant luxury restaurant homepage with dark background, gold accents, menu section and reservation form' },
  { cat:'business',   emoji:'🎂', name:'Catering business',    desc:'Events, gallery, booking form',        prompt:'Build an elegant catering business homepage with services for weddings and corporate events, gallery, and booking form' },
  { cat:'portfolio',  emoji:'🎨', name:'Creative portfolio',   desc:'Full-screen works grid',               prompt:'Build a creative portfolio homepage with full-screen hero, project grid and about section' },
  { cat:'ecommerce',  emoji:'🛍️', name:'Online store',         desc:'Products, featured items, newsletter', prompt:'Build an online store homepage with product grid, featured items section and newsletter signup' },
  { cat:'business',   emoji:'🏋️', name:'Gym & fitness',        desc:'Classes, trainers, membership',        prompt:'Build a gym and fitness homepage with classes schedule, trainer profiles and membership pricing' },
  { cat:'restaurant', emoji:'☕', name:'Café & coffee shop',   desc:'Menu, atmosphere, locations',          prompt:'Build a cozy cafe homepage with menu, atmosphere section and locations' },
  { cat:'portfolio',  emoji:'📸', name:'Photographer',         desc:'Gallery, packages, booking',           prompt:'Build a photographer portfolio with full-screen gallery, pricing packages and booking form' },
  { cat:'blog',       emoji:'✍️', name:'Personal blog',        desc:'Posts, categories, author bio',        prompt:'Build a personal blog homepage with featured posts, category filters and author bio section' },
  { cat:'business',   emoji:'🏥', name:'Medical clinic',       desc:'Services, doctors, appointments',      prompt:'Build a medical clinic homepage with services, doctor profiles and appointment booking form' },
  { cat:'ecommerce',  emoji:'💍', name:'Jewelry store',        desc:'Elegant product showcase',             prompt:'Build an elegant jewelry store homepage with product showcase, collections grid and brand story' },
  { cat:'business',   emoji:'🏠', name:'Real estate agency',  desc:'Listings, search, agents',             prompt:'Build a real estate agency homepage with property listings, search and agent profiles' },
  { cat:'portfolio',  emoji:'⚖️', name:'Law firm',             desc:'Practice areas, attorneys, contact',   prompt:'Build a professional law firm homepage with practice areas, attorney profiles and contact form' },
  { cat:'restaurant', emoji:'🍕', name:'Pizza restaurant',     desc:'Menu, order online, locations',        prompt:'Build a pizza restaurant homepage with menu, online ordering section and locations' },
  { cat:'blog',       emoji:'💻', name:'Tech blog',            desc:'Articles, tutorials, newsletter',      prompt:'Build a tech blog homepage with latest articles, tutorial categories and newsletter signup' },
  { cat:'business',   emoji:'✈️', name:'Travel agency',        desc:'Destinations, packages, booking',      prompt:'Build a travel agency homepage with featured destinations, travel packages and booking form' },
]

const FILTERS = ['All', 'Business', 'Portfolio', 'eCommerce', 'Restaurant', 'Blog']

const THUMB_COLORS = {
  business:   '#eff6ff',
  portfolio:  '#faf5ff',
  ecommerce:  '#fff7ed',
  restaurant: '#fef2f2',
  blog:       '#f0fdf4',
}

export default function Templates({ onSelect }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const router = useRouter()

  const visible = TEMPLATES.filter(t => {
    const matchCat = filter === 'all' || t.cat === filter.toLowerCase()
    const q = search.toLowerCase()
    const matchQ = !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
    return matchCat && matchQ
  })

  function use(prompt) {
    if (onSelect) {
      onSelect(prompt)
    } else {
      sessionStorage.setItem('pending_prompt', prompt)
      router.push('/auth?next=/chat')
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#18181b', letterSpacing: '-0.02em', marginBottom: 8 }}>
          Start from a template
        </h2>
        <p style={{ fontSize: 15, color: '#71717a' }}>
          Pick a template and AI will build it on your WordPress site instantly
        </p>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#fff', border: '1px solid #e4e4e7',
        borderRadius: 12, padding: '0 14px', marginBottom: 14,
        maxWidth: 400, margin: '0 auto 14px',
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search templates..."
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: 14, color: '#18181b', padding: '10px 0',
            background: 'transparent', fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
        {FILTERS.map(f => {
          const active = filter === f.toLowerCase() || (f === 'All' && filter === 'all')
          return (
            <button
              key={f}
              onClick={() => setFilter(f === 'All' ? 'all' : f.toLowerCase())}
              style={{
                fontSize: 13, fontWeight: 500,
                padding: '6px 16px', borderRadius: 999,
                border: '1px solid',
                borderColor: active ? '#18181b' : '#e4e4e7',
                background: active ? '#18181b' : '#fff',
                color: active ? '#fff' : '#52525b',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {f}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 12,
      }}>
        {visible.map((t, i) => (
          <div
            key={i}
            onClick={() => use(t.prompt)}
            style={{
              background: '#fff',
              border: '1px solid #e4e4e7',
              borderRadius: 14,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#a1a1aa'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e4e4e7'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Thumbnail */}
            <div style={{
              height: 90,
              background: THUMB_COLORS[t.cat] || '#f4f4f5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 34,
            }}>
              {t.emoji}
            </div>

            {/* Body */}
            <div style={{ padding: '10px 12px 13px', borderTop: '1px solid #f4f4f5' }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>
                {t.cat}
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#18181b', margin: '0 0 4px' }}>
                {t.name}
              </p>
              <p style={{ fontSize: 12, color: '#71717a', margin: 0, lineHeight: 1.4 }}>
                {t.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#a1a1aa', fontSize: 14 }}>
          No templates found for "{search}"
        </div>
      )}
    </div>
  )
}