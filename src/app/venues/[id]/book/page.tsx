import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import BookingForm from '@/components/BookingForm'

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/venues/${id}/book`)

  const { data: venue } = await supabase
    .from('venues')
    .select('*, cities(name)')
    .eq('id', id)
    .single()

  if (!venue) return notFound()

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh' }}>

      {/* Nav */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '0.5px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <a href={`/venues/${id}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '20px' }}>←</a>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>Reserve a table</span>
      </div>

      {/* Venue summary */}
      <div style={{
        margin: '24px', padding: '16px',
        background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)',
        borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '14px'
      }}>
        <div style={{
          width: '52px', height: '52px', background: 'var(--surface-2)',
          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'
        }}>
          🍽
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 500, color: '#fff', marginBottom: '3px' }}>{venue.name}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>📍 {venue.cities?.name}</div>
        </div>
      </div>

      {/* Booking form */}
      <BookingForm venueId={venue.id} userId={user.id} />

    </main>
  )
}