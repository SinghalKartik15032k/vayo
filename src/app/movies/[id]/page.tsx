import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: movie } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single()

  if (!movie) return notFound()

  const { data: showtimes } = await supabase
    .from('showtimes')
    .select('*, venues(name, address)')
    .eq('movie_id', id)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh' }}>

      {/* Nav */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '0.5px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <Link href="/movies" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '20px' }}>←</Link>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>{movie.title}</span>
      </div>

      {/* Hero */}
      <div style={{
        height: '200px', background: 'var(--surface-1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '72px', opacity: 0.2
      }}>
        🎬
      </div>

      {/* Movie info */}
      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 500, color: '#fff', marginBottom: '10px', letterSpacing: '-0.5px' }}>
          {movie.title}
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {movie.genre?.map((g: string) => (
            <span key={g} style={{
              padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
              background: 'var(--vayo-accent-muted)', color: 'var(--vayo-accent)',
              border: '0.5px solid var(--vayo-accent-border)'
            }}>{g}</span>
          ))}
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px', marginBottom: '32px'
        }}>
          {[
            { label: 'Language', value: movie.language },
            { label: 'Duration', value: `${movie.duration_min} min` },
            { label: 'Release', value: new Date(movie.release_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)',
              borderRadius: '12px', padding: '14px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Showtimes */}
        <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '16px' }}>
          Available showtimes
        </div>

        {!showtimes || showtimes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '14px' }}>
            No upcoming showtimes available
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {showtimes.map(showtime => {
              const start = new Date(showtime.start_time)
              const dateStr = start.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
              const timeStr = start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
              const almostFull = showtime.seats_available < 20
              const soldOut = showtime.seats_available === 0

              return (
                <Link
                  key={showtime.id}
                  href={soldOut ? '#' : `/movies/${id}/book/${showtime.id}`}
                  style={{ textDecoration: 'none', pointerEvents: soldOut ? 'none' : 'auto' }}
                >
                  <div style={{
                    background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)',
                    borderRadius: '14px', padding: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    opacity: soldOut ? 0.5 : 1
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '4px' }}>
                        {showtime.venues?.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        {showtime.venues?.address}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {dateStr} · {timeStr} · Screen {showtime.screen_number}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--vayo-accent)', marginBottom: '4px' }}>
                        ₹{showtime.price}
                      </div>
                      <div style={{ fontSize: '11px', color: almostFull ? '#f59e0b' : 'var(--text-muted)' }}>
                        {soldOut ? 'Sold out' : almostFull ? `${showtime.seats_available} left` : `${showtime.seats_available} seats`}
                      </div>
                      {!soldOut && (
                        <div style={{
                          marginTop: '8px', padding: '5px 12px',
                          background: 'var(--vayo-accent)', color: '#0a0a0a',
                          borderRadius: '8px', fontSize: '12px', fontWeight: 600
                        }}>
                          Select
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}