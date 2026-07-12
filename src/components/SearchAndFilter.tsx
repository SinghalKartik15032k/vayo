'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import HomeVenues from '@/components/HomeVenues'
import SearchOverlay from '@/components/SearchOverlay'

const tabs = [
  { label: 'All',         category: null },
  { label: 'Dining',      category: 'dining' },
  { label: 'Movies',      category: 'movies' },
  { label: 'Events',      category: 'events' },
  { label: 'Sports',      category: 'sports' },
  { label: 'Staycations', category: 'staycation' },
]

function chip(active: boolean): CSSProperties {
  return {
    padding: '8px 16px', borderRadius: '40px', fontSize: '13px',
    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
    border: active ? 'none' : '0.5px solid var(--border-default)',
    background: active ? 'var(--vayo-accent)' : 'var(--surface-2)',
    color: active ? '#0a0a0a' : 'var(--text-muted)',
    fontWeight: active ? 600 : 400,
  }
}

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export default function SearchAndFilter({
  venues,
  defaultCity,
}: {
  venues: any[]
  defaultCity?: string | null
}) {
  const [overlayOpen, setOverlayOpen]       = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [minRating, setMinRating]           = useState<number | null>(null)
  const [sortBy, setSortBy]                 = useState<'rating' | 'az'>('rating')
  const [sheetOpen, setSheetOpen]           = useState(false)

  const filtered = useMemo(() => {
    let r = venues
    if (defaultCity) r = r.filter(v => v.cities?.name === defaultCity)
    if (activeCategory) r = r.filter(v => v.category === activeCategory)
    if (minRating)      r = r.filter(v => (v.rating_avg ?? 0) >= minRating)
    if (sortBy === 'az') r = [...r].sort((a, b) => a.name.localeCompare(b.name))
    else r = [...r].sort((a, b) => (b.rating_avg ?? 0) - (a.rating_avg ?? 0))
    return r
  }, [venues, defaultCity, activeCategory, minRating, sortBy])

  const filterCount = [minRating].filter(Boolean).length

  function reset() {
    setMinRating(null)
    setSortBy('rating')
  }

  return (
    <>
      {overlayOpen && <SearchOverlay onClose={() => setOverlayOpen(false)} />}

      {/* Search bar */}
      <div
        onClick={() => setOverlayOpen(true)}
        style={{
          margin: '0 24px 20px',
          background: 'var(--surface-1)', border: '0.5px solid var(--border-default)',
          borderRadius: '12px', display: 'flex', alignItems: 'center',
          padding: '12px 16px', gap: '10px', cursor: 'text',
        }}
      >
        <IconSearch />
        <span style={{ flex: 1, fontSize: '14px', color: 'var(--text-muted)' }}>
          Search venues, movies, events...
        </span>
        <button
          onClick={e => { e.stopPropagation(); setSheetOpen(true) }}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: filterCount > 0 ? 'var(--vayo-accent)' : 'var(--surface-2)',
            border: filterCount > 0 ? 'none' : '0.5px solid var(--border-default)',
            borderRadius: '8px', padding: '6px 12px', fontSize: '12px',
            color: filterCount > 0 ? '#0a0a0a' : 'var(--vayo-accent)',
            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
          }}
        >
          Filter{filterCount > 0 ? ` (${filterCount})` : ''}
        </button>
      </div>

      {/* Category tabs */}
      <div style={{
        display: 'flex', gap: '8px', padding: '0 24px 24px',
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.label}
            onClick={() => setActiveCategory(tab.category)}
            style={{
              padding: '8px 16px', borderRadius: '40px', fontSize: '13px',
              whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
              fontFamily: 'inherit',
              border: activeCategory === tab.category ? 'none' : '0.5px solid var(--border-default)',
              background: activeCategory === tab.category ? 'var(--vayo-accent)' : 'var(--surface-1)',
              color: activeCategory === tab.category ? '#0a0a0a' : 'var(--text-muted)',
              fontWeight: activeCategory === tab.category ? 600 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Venue grid */}
      <HomeVenues venues={filtered} activeCategory={activeCategory} />

      {/* Filter bottom sheet */}
      {sheetOpen && (
        <div
          onClick={() => setSheetOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
            zIndex: 100, display: 'flex', alignItems: 'flex-end',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', background: 'var(--surface-1)',
              borderRadius: '20px 20px 0 0', padding: '20px 24px 32px',
              border: '0.5px solid var(--border-default)',
            }}
          >
            <div style={{
              width: '40px', height: '4px', background: 'var(--border-default)',
              borderRadius: '2px', margin: '0 auto 24px',
            }} />
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '24px' }}>Filters</div>

            {/* Rating */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Min Rating</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {([null, 3, 4, 4.5] as (number | null)[]).map(r => (
                  <button key={r ?? 'any'} onClick={() => setMinRating(r)} style={chip(minRating === r)}>
                    {r === null ? 'Any' : `${r}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Sort by</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setSortBy('rating')} style={chip(sortBy === 'rating')}>Top rated</button>
                <button onClick={() => setSortBy('az')}     style={chip(sortBy === 'az')}>A to Z</button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={reset} style={{
                flex: 1, padding: '14px', borderRadius: '12px',
                background: 'var(--surface-2)', border: '0.5px solid var(--border-default)',
                color: 'var(--text-muted)', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Reset
              </button>
              <button onClick={() => setSheetOpen(false)} style={{
                flex: 2, padding: '14px', borderRadius: '12px',
                background: 'var(--vayo-accent)', border: 'none',
                color: '#0a0a0a', fontSize: '14px', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Show {filtered.length} places
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
