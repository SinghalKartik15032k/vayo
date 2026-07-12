'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function IconSearch({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

const categoryEmoji: Record<string, string> = {
  dining: '🍽', movies: '🎬', events: '🎉', sports: '⚽', staycation: '🏨',
}

const categoryColor: Record<string, string> = {
  dining: '#e07b39', movies: '#6c63ff', events: '#e63c6e', sports: '#27ae60', staycation: '#0ea5e9',
}

type Results = {
  venues: any[]
  movies: any[]
  events: any[]
}

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Results>({ venues: [], movies: [], events: [] })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  // Auto-focus input when overlay opens
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ venues: [], movies: [], events: [] })
      return
    }
    const timer = setTimeout(async () => {
      setLoading(true)
      const ilike = `%${query.trim()}%`
      const [{ data: venues }, { data: movies }, { data: events }] = await Promise.all([
        supabase
          .from('venues')
          .select('id, name, category, address, rating_avg, cities(name)')
          .or(`name.ilike.${ilike},address.ilike.${ilike}`)
          .order('rating_avg', { ascending: false })
          .limit(5),
        supabase
          .from('movies')
          .select('id, title, genre, language, duration_min')
          .ilike('title', ilike)
          .limit(5),
        supabase
          .from('events')
          .select('id, title, venues(name, cities(name))')
          .ilike('title', ilike)
          .limit(5),
      ])
      setResults({ venues: venues ?? [], movies: movies ?? [], events: events ?? [] })
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const total = results.venues.length + results.movies.length + results.events.length
  const hasQuery = query.trim().length > 0

  function navigate(href: string) {
    onClose()
    router.push(href)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'var(--background)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Search input row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px 16px',
        borderBottom: '0.5px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '6px',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '8px', flexShrink: 0,
          }}
        >
          <IconBack />
        </button>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
          background: 'var(--surface-1)', border: '0.5px solid var(--border-default)',
          borderRadius: '12px', padding: '10px 14px',
        }}>
          <span style={{ color: 'var(--text-muted)', display: 'flex' }}>
            <IconSearch size={15} />
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Venues, movies, events..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: '15px', color: 'var(--foreground)', fontFamily: 'inherit',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'var(--surface-2)', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', width: '18px', height: '18px', borderRadius: '50%',
                fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontFamily: 'inherit',
              }}
            >
              x
            </button>
          )}
        </div>
      </div>

      {/* Results area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>

        {/* Empty / idle state */}
        {!hasQuery && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '64px 24px', gap: '10px', color: 'var(--text-muted)',
          }}>
            <IconSearch size={28} />
            <div style={{ fontSize: '14px', marginTop: '4px' }}>Search across venues, movies & events</div>
          </div>
        )}

        {/* Loading */}
        {hasQuery && loading && (
          <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            Searching...
          </div>
        )}

        {/* No results */}
        {hasQuery && !loading && total === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '64px 24px', gap: '10px',
          }}>
            <IconSearch size={28} />
            <div style={{ fontSize: '15px', color: '#fff', fontWeight: 500 }}>No results for &ldquo;{query}&rdquo;</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
              Try a different keyword
            </div>
          </div>
        )}

        {/* Venues */}
        {results.venues.length > 0 && (
          <section style={{ marginBottom: '8px' }}>
            <div style={{
              fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase',
              letterSpacing: '0.8px', fontWeight: 600, padding: '12px 20px 8px',
            }}>
              Venues
            </div>
            {results.venues.map((v: any) => (
              <button
                key={v.id}
                onClick={() => navigate(`/venues/${v.id}`)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'inherit',
                  borderBottom: '0.5px solid var(--border-subtle)',
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                  background: categoryColor[v.category] ? `${categoryColor[v.category]}18` : 'var(--surface-2)',
                  border: `0.5px solid ${categoryColor[v.category] ? `${categoryColor[v.category]}44` : 'var(--border-default)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                }}>
                  {categoryEmoji[v.category] ?? '📍'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {v.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {v.cities?.name ?? v.address}
                    {v.rating_avg ? ` · ★ ${v.rating_avg}` : ''}
                  </div>
                </div>
                <span style={{
                  fontSize: '10px', padding: '3px 8px', borderRadius: '6px', flexShrink: 0,
                  background: categoryColor[v.category] ? `${categoryColor[v.category]}18` : 'var(--surface-2)',
                  color: categoryColor[v.category] ?? 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600,
                }}>
                  {v.category}
                </span>
              </button>
            ))}
          </section>
        )}

        {/* Movies */}
        {results.movies.length > 0 && (
          <section style={{ marginBottom: '8px' }}>
            <div style={{
              fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase',
              letterSpacing: '0.8px', fontWeight: 600, padding: '12px 20px 8px',
            }}>
              Movies
            </div>
            {results.movies.map((m: any) => (
              <button
                key={m.id}
                onClick={() => navigate(`/movies/${m.id}`)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'inherit',
                  borderBottom: '0.5px solid var(--border-subtle)',
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                  background: '#6c63ff18', border: '0.5px solid #6c63ff44',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                }}>
                  🎬
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {[m.genre, m.language, m.duration_min ? `${m.duration_min} min` : null].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <span style={{
                  fontSize: '10px', padding: '3px 8px', borderRadius: '6px', flexShrink: 0,
                  background: '#6c63ff18', color: '#6c63ff',
                  textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600,
                }}>
                  Movie
                </span>
              </button>
            ))}
          </section>
        )}

        {/* Events */}
        {results.events.length > 0 && (
          <section style={{ marginBottom: '8px' }}>
            <div style={{
              fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase',
              letterSpacing: '0.8px', fontWeight: 600, padding: '12px 20px 8px',
            }}>
              Events
            </div>
            {results.events.map((e: any) => (
              <button
                key={e.id}
                onClick={() => navigate(`/events/${e.id}`)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'inherit',
                  borderBottom: '0.5px solid var(--border-subtle)',
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                  background: '#e63c6e18', border: '0.5px solid #e63c6e44',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                }}>
                  🎉
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {e.venues?.name}{e.venues?.cities?.name ? ` · ${e.venues.cities.name}` : ''}
                  </div>
                </div>
                <span style={{
                  fontSize: '10px', padding: '3px 8px', borderRadius: '6px', flexShrink: 0,
                  background: '#e63c6e18', color: '#e63c6e',
                  textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600,
                }}>
                  Event
                </span>
              </button>
            ))}
          </section>
        )}

      </div>
    </div>
  )
}
