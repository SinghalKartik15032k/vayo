import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: venues, error } = await supabase
    .from('venues')
    .select('name, category, address, rating_avg, cities(name)')
    .order('rating_avg', { ascending: false })

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '700px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Vayo 🚀</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem' }}>
          {user ? (
            <>
              <span style={{ color: '#444' }}>
                👋 {user.user_metadata?.full_name ?? user.email}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: '#444', textDecoration: 'underline' }}>Log in</Link>
              <Link href="/signup" style={{ color: 'black', fontWeight: 600, textDecoration: 'underline' }}>Sign up</Link>
            </>
          )}
        </div>
      </div>

      {/* Venues list */}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {venues && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {venues.map((venue, i) => (
            <li key={i} style={{ padding: '1rem', marginBottom: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }}>
              <strong>{venue.name}</strong>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                {venue.category} · {venue.address}
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                ⭐ {venue.rating_avg ?? '—'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}