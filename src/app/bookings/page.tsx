import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function BookingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/bookings')

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch venue names for dining bookings
  const venueIds = bookings
    ?.filter(b => b.booking_type === 'dining')
    .map(b => b.reference_id) ?? []

  const { data: venues } = venueIds.length > 0
    ? await supabase.from('venues').select('id, name, category, cities(name)').in('id', venueIds)
    : { data: [] }

  const venueMap = Object.fromEntries((venues ?? []).map(v => [v.id, v]))

  const statusColors: Record<string, string> = {
    confirmed: 'var(--vayo-accent)',
    pending: '#f59e0b',
    cancelled: '#ef4444',
  }

  const categoryIcons: Record<string, string> = {
    dining: '🍽', movies: '🎬', events: '🎉', sports: '⚽',
  }

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh' }}>

      {/* Nav */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '0.5px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '20px' }}>←</Link>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>My Bookings</span>
        <div style={{ width: '20px' }} />
      </div>

      <div style={{ padding: '24px' }}>
        {!bookings || bookings.length === 0 ? (
          /* Empty state */
          <div style={{
            textAlign: 'center', padding: '60px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'
          }}>
            <div style={{ fontSize: '48px', opacity: 0.3 }}>🎟</div>
            <div style={{ fontSize: '18px', fontWeight: 500, color: '#fff' }}>No bookings yet</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Your reservations and tickets will appear here
            </div>
            <Link href="/" style={{
              marginTop: '8px', padding: '12px 24px',
              background: 'var(--vayo-accent)', color: '#0a0a0a',
              borderRadius: '12px', fontWeight: 600, fontSize: '14px', textDecoration: 'none'
            }}>
              Explore venues
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bookings.map(booking => {
              const venue = venueMap[booking.reference_id]
              const bookingDate = new Date(booking.booking_time)
              const dateStr = bookingDate.toLocaleDateString('en-IN', {
                weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
              })
              const timeStr = bookingDate.toLocaleTimeString('en-IN', {
                hour: '2-digit', minute: '2-digit'
              })
              const isPast = bookingDate < new Date()

              return (
                <div key={booking.id} style={{
                  background: 'var(--surface-1)',
                  border: '0.5px solid var(--border-subtle)',
                  borderRadius: '16px', overflow: 'hidden',
                  opacity: isPast ? 0.6 : 1
                }}>
                  {/* Card header */}
                  <div style={{
                    padding: '16px', display: 'flex',
                    alignItems: 'center', gap: '14px',
                    borderBottom: '0.5px solid var(--border-subtle)'
                  }}>
                    <div style={{
                      width: '48px', height: '48px',
                      background: 'var(--surface-2)', borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px'
                    }}>
                      {categoryIcons[booking.booking_type] ?? '📍'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 500, color: '#fff', marginBottom: '3px' }}>
                        {venue?.name ?? `Booking #${booking.id.slice(0, 8).toUpperCase()}`}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {venue?.cities?.name ?? booking.booking_type}
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500,
                      background: `${statusColors[booking.status] ?? '#888'}20`,
                      color: statusColors[booking.status] ?? '#888',
                      border: `0.5px solid ${statusColors[booking.status] ?? '#888'}40`,
                      textTransform: 'capitalize'
                    }}>
                      {booking.status}
                    </div>
                  </div>

                  {/* Card details */}
                  <div style={{
                    padding: '14px 16px',
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'
                  }}>
                    {[
                      { label: 'Date', value: dateStr },
                      { label: 'Time', value: timeStr },
                      { label: 'Guests', value: `${booking.quantity}` },
                    ].map(item => (
                      <div key={item.label}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Booking ID footer */}
                  <div style={{
                    padding: '10px 16px',
                    borderTop: '0.5px solid var(--border-subtle)',
                    fontSize: '11px', color: 'var(--text-muted)'
                  }}>
                    #{booking.id.slice(0, 8).toUpperCase()} · {isPast ? 'Past booking' : 'Upcoming'}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}