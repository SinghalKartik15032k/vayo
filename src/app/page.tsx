import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import VenueCard from '@/components/VenueCard'
import CategoryTabs from '@/components/CategoryTabs'
import DynamicGreeting from '@/components/DynamicGreeting'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('full_name, city_id, cities(name)').eq('id', user.id).single()
    : { data: null }

  const { data: venues } = await supabase
    .from('venues')
    .select('id, name, category, address, rating_avg, cities(name)')
    .order('rating_avg', { ascending: false })

  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 24px', borderBottom: '0.5px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '22px', fontWeight: 500, letterSpacing: '-0.5px', color: '#fff' }}>
          vayo<span style={{ color: 'var(--vayo-accent)' }}>.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--surface-1)', border: '0.5px solid var(--border-default)',
            borderRadius: '20px', padding: '6px 14px', fontSize: '13px', color: '#aaa', cursor: 'pointer'
          }}>
            📍 {profile?.cities?.name ?? 'Select city'}
          </div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'var(--surface-1)', border: '1.5px solid var(--vayo-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 500, color: 'var(--vayo-accent)'
              }}>
                {(profile?.full_name ?? user.email ?? 'U')[0].toUpperCase()}
              </div>
              <LogoutButton />
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
              <Link href="/login" style={{ color: '#aaa', textDecoration: 'none' }}>Log in</Link>
              <Link href="/signup" style={{
                color: '#0a0a0a', background: 'var(--vayo-accent)',
                padding: '6px 14px', borderRadius: '20px', fontWeight: 500, textDecoration: 'none'
              }}>Sign up</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Dynamic greeting */}
      <DynamicGreeting
        name={profile?.full_name ?? null}
        city={profile?.cities?.name ?? null}
      />

      {/* Search bar */}
      <div style={{
        margin: '0 24px 24px',
        background: 'var(--surface-1)', border: '0.5px solid var(--border-default)',
        borderRadius: '12px', display: 'flex', alignItems: 'center',
        padding: '12px 16px', gap: '10px'
      }}>
        <span style={{ fontSize: '16px' }}>🔍</span>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Search venues, movies, events…</span>
        <div style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px',
          background: 'var(--surface-2)', border: '0.5px solid var(--border-default)',
          borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: 'var(--vayo-accent)'
        }}>
          ⚙ Filter
        </div>
      </div>

      {/* Category tabs */}
      <CategoryTabs />

      {/* Quick actions */}
      <div style={{ padding: '0 24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {[
            { icon: '🍽', label: 'Book a table', href: '/' },
            { icon: '🎬', label: 'Movie tickets', href: '/movies' },
            { icon: '⚽', label: 'Sports & Games', href: '/sports' },
            { icon: '🎉', label: 'Events near you', href: '/events' },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                padding: '14px 8px', background: 'var(--surface-1)',
                border: '0.5px solid var(--border-subtle)', borderRadius: '12px', cursor: 'pointer'
              }}>
                <span style={{ fontSize: '22px' }}>{item.icon}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top rated venues */}
      <div style={{ padding: '0 24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff' }}>Top rated near you</div>
          <div style={{ fontSize: '12px', color: 'var(--vayo-accent)', cursor: 'pointer' }}>See all</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {venues?.map(venue => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'sticky', bottom: 0,
        background: 'var(--surface-1)', borderTop: '0.5px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-around', padding: '10px 0 16px'
      }}>
        {[
          { icon: '🏠', label: 'Home', href: '/', active: true },
          { icon: '🧭', label: 'Explore', href: '/' },
          { icon: '🎟', label: 'Bookings', href: '/bookings' },
          { icon: '❤️', label: 'Saved', href: '/' },
          { icon: '👤', label: 'Profile', href: '/profile' },
        ].map(item => (
          <Link key={item.label} href={item.href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            fontSize: '10px', color: item.active ? 'var(--vayo-accent)' : 'var(--text-muted)',
            cursor: 'pointer', textDecoration: 'none'
          }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

    </main>
  )
}
