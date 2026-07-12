import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import SearchAndFilter from '@/components/SearchAndFilter'
import DynamicGreeting from '@/components/DynamicGreeting'
import BottomNav from '@/components/BottomNav'
import CityPicker from '@/components/CityPicker'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('full_name, city_id, cities(id, name)').eq('id', user.id).single()
    : { data: null }

  const { data: venues } = await supabase
    .from('venues')
    .select('id, name, category, address, rating_avg, cities(name)')
    .order('rating_avg', { ascending: false })

  const { data: cities } = await supabase
    .from('cities')
    .select('id, name')
    .order('name')

  const profileCity = profile?.cities as { id: string; name: string } | null

  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 24px', borderBottom: '0.5px solid var(--border-subtle)',
      }}>
        <div style={{ fontSize: '22px', fontWeight: 500, letterSpacing: '-0.5px', color: '#fff' }}>
          vayo<span style={{ color: 'var(--vayo-accent)' }}>.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CityPicker
        cities={cities ?? []}
          currentCityName={profileCity?.name ?? null}
            currentCityId={profileCity?.id ?? null}
            userId={user?.id ?? null}
          />
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link href="/profile" style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'var(--surface-1)', border: '1.5px solid var(--vayo-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 500, color: 'var(--vayo-accent)',
                textDecoration: 'none',
              }}>
                {(profile?.full_name ?? user.email ?? 'U')[0].toUpperCase()}
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
              <Link href="/login" style={{ color: '#aaa', textDecoration: 'none' }}>Log in</Link>
              <Link href="/signup" style={{
                color: '#0a0a0a', background: 'var(--vayo-accent)',
                padding: '6px 14px', borderRadius: '20px', fontWeight: 500, textDecoration: 'none',
              }}>Sign up</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Dynamic greeting */}
      <DynamicGreeting name={profile?.full_name ?? null} city={profileCity?.name ?? null} />

      {/* Quick actions */}
      <div style={{ padding: '0 24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {[
            { icon: '🍽️', label: 'Book a table',    href: '/' },
            { icon: '🎬', label: 'Movie tickets',   href: '/movies' },
            { icon: '⚽', label: 'Sports & Games',  href: '/sports' },
            { icon: '🎉', label: 'Events near you', href: '/events' },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                padding: '14px 8px', background: 'var(--surface-1)',
                border: '0.5px solid var(--border-subtle)', borderRadius: '12px', cursor: 'pointer',
              }}>
                <span style={{ fontSize: '22px' }}>{item.icon}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Search + Filter + Venue grid */}
      <SearchAndFilter
        venues={venues ?? []}
defaultCity={profileCity?.name ?? null}
      />

      {/* Bottom nav */}
      <BottomNav />

    </main>
  )
}


