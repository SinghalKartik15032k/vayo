'use client'
import { useState } from 'react'
import VenueCard from '@/components/VenueCard'

const tabs = [
  { label: 'All',        icon: '✨', category: null },
  { label: 'Dining',     icon: '🍽', category: 'dining' },
  { label: 'Movies',     icon: '🎬', category: 'movies' },
  { label: 'Events',     icon: '🎉', category: 'events' },
  { label: 'Sports',     icon: '⚽', category: 'sports' },
  { label: 'Staycations',icon: '🏨', category: 'staycation' },
]

export default function HomeVenues({ venues }: { venues: any[] }) {
  const [active, setActive] = useState<string | null>(null)

  const filtered = active
    ? venues.filter(v => v.category === active)
    : venues

  return (
    <>
      {/* Category tabs */}
      <div style={{
        display: 'flex', gap: '8px', padding: '0 24px 24px',
        overflowX: 'auto', scrollbarWidth: 'none'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.label}
            onClick={() => setActive(tab.category)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '8px 16px', borderRadius: '40px', fontSize: '13px',
              whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
              border: active === tab.category ? 'none' : '0.5px solid var(--border-default)',
              background: active === tab.category ? 'var(--vayo-accent)' : 'var(--surface-1)',
              color: active === tab.category ? '#0a0a0a' : 'var(--text-muted)',
              fontWeight: active === tab.category ? 500 : 400,
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Venue grid */}
      <div style={{ padding: '0 24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff' }}>
            {active ? `${tabs.find(t => t.category === active)?.label} near you` : 'Top rated near you'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {filtered.length} places
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'
          }}>
            <div style={{ fontSize: '40px', opacity: 0.3 }}>🔍</div>
            <div style={{ fontSize: '15px', color: 'var(--text-muted)' }}>No venues in this category yet</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {filtered.map(venue => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
