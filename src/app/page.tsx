import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  const { data: venues, error } = await supabase
    .from('venues')
    .select('name, category, address, rating_avg, cities(name)')
    .order('rating_avg', { ascending: false })

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Vayo 🚀</h1>

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
                ⭐ {venue.rating_avg}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
