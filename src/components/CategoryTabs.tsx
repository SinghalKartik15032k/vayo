'use client'

import { useState } from 'react'

const tabs = [
  { label: 'Dining', icon: '🍽' },
  { label: 'Movies', icon: '🎬' },
  { label: 'Events', icon: '🎉' },
  { label: 'Sports', icon: '⚽' },
  { label: 'Staycations', icon: '🏨' },
]

export default function CategoryTabs() {
  const [active, setActive] = useState('Dining')

  return (
    <div style={{
      display: 'flex', gap: '8px', padding: '0 24px 24px',
      overflowX: 'auto', scrollbarWidth: 'none'
    }}>
      {tabs.map(tab => (
        <button
          key={tab.label}
          onClick={() => setActive(tab.label)}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '8px 16px', borderRadius: '40px', fontSize: '13px',
            whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
            border: active === tab.label ? 'none' : '0.5px solid var(--border-default)',
            background: active === tab.label ? 'var(--vayo-accent)' : 'var(--surface-1)',
            color: active === tab.label ? '#0a0a0a' : 'var(--text-muted)',
            fontWeight: active === tab.label ? 500 : 400,
          }}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  )
}