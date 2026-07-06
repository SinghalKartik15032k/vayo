import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import TurfBookingForm from '@/components/TurfBookingForm'

export default async function SportsVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: venue } = await supabase
    .from('venues')
    .select('*, cities(name)')
    .eq('id', id)
    .single()

  if (!venue) return notFound()

  const { data: slots } = await supabase
    .from('turf_slots')
    .select('*')
    .eq('venue_id', id)
    .eq('is_booked', false)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh' }}>

      <div style={{
        padding: '18px 24px',
        borderBottom: '0.5px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <Link href="/sports" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '20px' }}>←</Link>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>{venue.name}</span>
      </div>

      {/* Hero */}
      <div style={{
        height: '180px', background: 'var(--surface-1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '72px', opacity: 0.15
      }}>
        ⚽
      </div>

      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 500, color: '#fff', marginBottom: '8px', letterSpacing: '-0.5px' }}>
          {venue.name}
        </h1>
        <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>
          📍 {venue.address}, {venue.cities?.name}
        </div>
        {venue.rating_avg && (
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            ★ {venue.rating_avg}
          </div>
        )}

        {venue.description && (
          <div style={{
            fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6,
            padding: '14px', background: 'var(--surface-1)',
            borderRadius: '12px', border: '0.5px solid var(--border-subtle)',
            marginBottom: '24px'
          }}>
            {venue.description}
          </div>
        )}

        <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '16px' }}>
          Available slots
        </div>

        {!slots || slots.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px',
            color: 'var(--text-muted)', fontSize: '14px',
            background: 'var(--surface-1)', borderRadius: '14px'
          }}>
            No slots available right now
          </div>
        ) : (
          <TurfBookingForm
            slots={slots}
            userId={user?.id ?? null}
            venueId={venue.id}
          />
        )}
      </div>
    </main>
  )
}