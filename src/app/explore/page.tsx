import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

const collections = [
  { label: 'Date Night',       emoji: '🕯️',  category: 'dining',  href: '/' },
  { label: 'This Weekend',     emoji: '🎉',  category: 'events',  href: '/events' },
  { label: 'Sports & Games',   emoji: '⚽',  category: 'sports',  href: '/sports' },
  { label: 'Movie Night',      emoji: '🎬',  category: 'movies',  href: '/movies' },
  { label: 'Fine Dining',      emoji: '🍽️',  category: 'dining',  href: '/' },
  { label: 'Live Events',      emoji: '🎤',  category: 'events',  href: '/events' },
]

const categoryColor: Record<string, string> = {
  dining:     '#e07b39',
  movies:     '#6c63ff',
  events:     '#e63c6e',
  sports:     '#27ae60',
  staycation: '#0ea5e9',
}

export default async function ExplorePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('city_id, cities(name)').eq('id', user.id).single()
    : { data: null }

  const profileCity = profile?.cities as { name: string } | null

  const { data: trending } = await supabase
    .from('venues')
    .select('id, name, category, address, rating_avg, cities(name)')
    .order('rating_avg', { ascending: false })
    .limit(10)

  const { data: newArrivals } = await supabase
    .from('venues')
    .select('id, name, category, address, rating_avg, cities(name)')
    .order('id', { ascending: false })
    .limit(6)

  const { data: events } = await supabase
    .from('events')
    .select('id, title, venues(name, cities(name))')
    .limit(6)

  const { data: movies } = await supabase
    .from('movies')
    .select('id, title, genre, language, duration_min')
    .limit(6)

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh', paddingBottom: '100px' }}>

      {/* Header */}
      <div style={{ padding: '20px 24px 16px', borderBottom: '0.5px solid var(--border-subtle)' }}>
        <div style={{ fontSize: '22px', fontWeight: 600, color: '#fff', letterSpacing: '-0.3px' }}>
          Explore
        </div>
        {profileCity?.name && (
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>
            Discover what&apos;s happening in {profileCity.name}
          </div>
        )}
      </div>

      <div style={{ padding: '24px 0' }}>

        {/* Collections */}
        <section style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600, padding: '0 24px', marginBottom: '14px' }}>
            Collections
          </div>
          <div style={{ display: 'flex', gap: '10px', padding: '0 24px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {collections.map(col => (
              <Link key={col.label} href={col.href} style={{ textDecoration: 'none', flexShrink: 0 }}>
                <div style={{
                  width: '130px', padding: '16px 14px',
                  background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)',
                  borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px',
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: categoryColor[col.category] ? `${categoryColor[col.category]}18` : 'var(--surface-2)',
                    border: `0.5px solid ${categoryColor[col.category] ? `${categoryColor[col.category]}44` : 'var(--border-default)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                  }}>
                    {col.emoji}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', lineHeight: 1.3 }}>
                    {col.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending venues */}
        {trending && trending.length > 0 && (
          <section style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>Trending</div>
              <Link href="/" style={{ fontSize: '12px', color: 'var(--vayo-accent)', textDecoration: 'none' }}>See all</Link>
            </div>
            <div style={{ display: 'flex', gap: '12px', padding: '0 24px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {trending.map((v: any) => (
                <Link key={v.id} href={`/venues/${v.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <div style={{ width: '160px', background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)', borderRadius: '14px', overflow: 'hidden' }}>
                    <div style={{ height: '90px', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <span style={{ fontSize: '28px', opacity: 0.35 }}>
                        {v.category === 'dining' ? '🍽' : v.category === 'movies' ? '🎬' : v.category === 'events' ? '🎉' : v.category === 'sports' ? '⚽' : '📍'}
                      </span>
                      {v.rating_avg && (
                        <div style={{ position: 'absolute', bottom: '7px', right: '7px', background: 'rgba(0,0,0,0.7)', borderRadius: '6px', padding: '2px 7px', fontSize: '11px', color: '#ffd700' }}>
                          ★ {v.rating_avg}
                        </div>
                      )}
                      <div style={{
                        position: 'absolute', bottom: '7px', left: '7px',
                        background: categoryColor[v.category] ? `${categoryColor[v.category]}22` : 'var(--surface-2)',
                        border: `0.5px solid ${categoryColor[v.category] ? `${categoryColor[v.category]}55` : 'var(--border-default)'}`,
                        borderRadius: '5px', padding: '2px 7px',
                        fontSize: '9px', color: categoryColor[v.category] ?? 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600,
                      }}>
                        {v.category}
                      </div>
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>{v.cities?.name ?? v.address}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming events */}
        {events && events.length > 0 && (
          <section style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>Upcoming Events</div>
              <Link href="/events" style={{ fontSize: '12px', color: 'var(--vayo-accent)', textDecoration: 'none' }}>See all</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 24px' }}>
              {events.map((e: any) => (
                <Link key={e.id} href={`/events/${e.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)', borderRadius: '14px', padding: '14px 16px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0, background: '#e63c6e18', border: '0.5px solid #e63c6e44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                      🎉
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                        {e.venues?.name}{e.venues?.cities?.name ? ` · ${e.venues.cities.name}` : ''}
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '6px', flexShrink: 0, background: '#e63c6e18', color: '#e63c6e', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>Event</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Movies */}
        {movies && movies.length > 0 && (
          <section style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>Now Showing</div>
              <Link href="/movies" style={{ fontSize: '12px', color: 'var(--vayo-accent)', textDecoration: 'none' }}>See all</Link>
            </div>
            <div style={{ display: 'flex', gap: '12px', padding: '0 24px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {movies.map((m: any) => (
                <Link key={m.id} href={`/movies/${m.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <div style={{ width: '130px', background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)', borderRadius: '14px', overflow: 'hidden' }}>
                    <div style={{ height: '160px', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '32px', opacity: 0.3 }}>🎬</span>
                    </div>
                    <div style={{ padding: '10px 12px 12px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {[m.genre, m.language].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* New on Vayo */}
        {newArrivals && newArrivals.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>New on Vayo</div>
              <Link href="/" style={{ fontSize: '12px', color: 'var(--vayo-accent)', textDecoration: 'none' }}>See all</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', padding: '0 24px' }}>
              {newArrivals.map((v: any) => (
                <Link key={v.id} href={`/venues/${v.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)', borderRadius: '14px', overflow: 'hidden' }}>
                    <div style={{ height: '80px', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <span style={{ fontSize: '24px', opacity: 0.3 }}>
                        {v.category === 'dining' ? '🍽' : v.category === 'movies' ? '🎬' : v.category === 'events' ? '🎉' : v.category === 'sports' ? '⚽' : '📍'}
                      </span>
                      {v.rating_avg && (
                        <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.7)', borderRadius: '5px', padding: '2px 6px', fontSize: '10px', color: '#ffd700' }}>
                          ★ {v.rating_avg}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '9px 11px 11px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{v.cities?.name ?? v.address}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>

      <BottomNav />
    </main>
  )
}
