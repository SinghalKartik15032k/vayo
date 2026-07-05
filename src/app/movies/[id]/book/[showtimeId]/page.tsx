import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import MovieBookingForm from '@/components/MovieBookingForm'

export default async function MovieBookPage({
  params
}: {
  params: Promise<{ id: string, showtimeId: string }>
}) {
  const { id, showtimeId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/movies/${id}/book/${showtimeId}`)

  const { data: showtime } = await supabase
    .from('showtimes')
    .select('*, movies(*), venues(name, address)')
    .eq('id', showtimeId)
    .single()

  if (!showtime) return notFound()

  const start = new Date(showtime.start_time)
  const dateStr = start.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
  const timeStr = start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh' }}>

      {/* Nav */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '0.5px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <Link href={`/movies/${id}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '20px' }}>←</Link>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>Book tickets</span>
      </div>

      {/* Showtime summary card */}
      <div style={{ margin: '24px', padding: '18px', background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)', borderRadius: '16px' }}>
        <div style={{ fontSize: '17px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>
          {showtime.movies?.title}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
          🎭 {showtime.venues?.name} · Screen {showtime.screen_number}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
          📅 {dateStr} · {timeStr}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '12px', background: 'var(--surface-2)', borderRadius: '10px'
        }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Price per ticket</span>
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--vayo-accent)' }}>₹{showtime.price}</span>
        </div>
      </div>

      {/* Booking form */}
      <MovieBookingForm
        showtimeId={showtime.id}
        userId={user.id}
        movieId={id}
        pricePerTicket={Number(showtime.price)}
        seatsAvailable={showtime.seats_available}
        startTime={showtime.start_time}
      />
    </main>
  )
}