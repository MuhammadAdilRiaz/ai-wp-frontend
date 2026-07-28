'use client'
import { useState } from 'react'
import Link from 'next/link'

const COLUMNS = [
  {
    title: 'Company',
    links: ['Careers', 'Press & media', 'Enterprise', 'Security', 'Trust center', 'Partnerships'],
  },
  {
    title: 'Product',
    links: [
      'Pricing', 'Student discount', 'For Work', 'Founders', 'Product Managers',
      'Designers', 'Marketers', 'Sales', 'Ops', 'People', 'Prototyping',
      'Internal Tools', 'Download apps', 'Connections', 'Changelog', 'Status',
    ],
  },
  {
    title: 'Resources',
    links: ['Learn', 'Templates', 'Guides', 'Connectors', 'MCP server', 'Videos', 'Blog', 'Support', 'Reviews', 'Sitemap'],
  },
  {
    title: 'Legal',
    links: [
      'Privacy policy', 'Do not sell or share my personal information', 'Cookie settings',
      'Enterprise terms', 'General terms', 'Desktop app terms', 'Domain registration terms',
      'DMCA copyright policy', 'Platform rules', 'Report abuse', 'Report security concerns', 'DPA',
    ],
  },
  {
    title: 'Community',
    links: ['Become a partner', 'Hire a Lovable expert', 'Affiliates', 'Code of conduct', 'Discord', 'Reddit', 'X / Twitter', 'YouTube', 'LinkedIn'],
  },
]

const LANGUAGES = [
  { code: 'EN', label: 'English' },
  { code: 'DE', label: 'Deutsch' },
  { code: 'ES', label: 'Español' },
  { code: 'FR', label: 'Français' },
  { code: 'HI', label: 'हिंदी' },
  { code: 'ID', label: 'Bahasa Indonesia' },
  { code: 'IT', label: 'Italiano' },
  { code: 'JA', label: '日本語' },
  { code: 'KO', label: '한국어' },
  { code: 'PT-BR', label: 'Português' },
  { code: 'TH', label: 'ไทย' },
]

export default function Footer() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('EN')

  return (
    <footer style={{
      background: '#f6f3ec',
      padding: '48px 48px 32px',
      borderTop: '1px solid #e7e2d6',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        background: '#f6f3ec',
        border: '1px solid #e7e2d6',
        borderRadius: 20,
        padding: '32px 40px 24px',
      }}>
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          {/* Logo + language selector */}
          <div style={{ minWidth: 160, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg, #f97316, #ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>

            <div style={{ position: 'relative', marginTop: 120 }}>
              {open && (
                <div style={{
                  position: 'absolute', bottom: 40, left: 0,
                  width: 170, background: '#fff', border: '1px solid #e4e4e7',
                  borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  padding: 6, zIndex: 20,
                }}>
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setSelected(lang.code); setOpen(false) }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 8, padding: '7px 10px', background: 'none', border: 'none', cursor: 'pointer',
                        borderRadius: 8, fontSize: 13, color: '#18181b', textAlign: 'left',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f4f4f5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ display: 'flex', gap: 8 }}>
                        <span style={{ color: '#71717a', fontWeight: 600, width: 26 }}>{lang.code}</span>
                        <span>{lang.label}</span>
                      </span>
                      {selected === lang.code && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setOpen(!open)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, color: '#3f3f46', padding: 0,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20z" />
                </svg>
                {selected}
              </button>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map(col => (
            <div key={col.title} style={{ minWidth: 150, flex: '1 1 150px' }}>
              <h4 style={{
                fontSize: 13, fontWeight: 500, color: '#a8a29e',
                margin: '0 0 14px',
              }}>
                {col.title}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map(link => (
                  <Link
                    key={link}
                    href="#"
                    style={{
                      fontSize: 13.5, fontWeight: 600, color: '#18181b',
                      textDecoration: 'underline', textUnderlineOffset: 3,
                      textDecorationColor: '#d6d0c4', lineHeight: 1.5,
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}