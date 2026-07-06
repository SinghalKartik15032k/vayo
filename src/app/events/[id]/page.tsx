import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import EventBookingForm from '@/components/EventBookingForm'

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: event } = await supabase
    .from('events')
    .select('*, venues(name, address, cities(name))')
    .eq('id', id)
    .single()

  if (!event) return notFound()

  const { data: tiers } = await supabase
    .from('ticket_tiers')
    .select('*')
    .eq('event_id', id)
    .order('price', { ascending: true })

  const start = new Date(event.start_time)
  const end = new Date(event.end_time)
  const dateStr = start.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const timeStr = `${start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh' }}>

      <div style={{
        padding: '18px 24px',
        borderBottom: '0.5px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <Link href="/events" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '20px' }}>←</Link>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>{event.title}</span>
      </div>

      {/* Hero */}
      <div style={{
        height: '200px', background: 'var(--surface-1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '72px', opacity: 0.15, position: 'relative'
      }}>
        🎉
        <div style={{
          position: 'absolute', top: '16px', left: '24px',
          background: 'var(--vayo-accent)', color: '#0a0a0a',
          borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 600
        }}>
          {event.category}
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 500, color: '#fff', marginBottom: '12px', letterSpacing: '-0.5px' }}>
          {event.title}
        </h1>

        {/* Info rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            📍 {event.venues?.name}, {event.venues?.cities?.name}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            📅 {dateStr}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            🕐 {timeStr}
          </div>
        </div>

        {event.description && (
          <div style={{
            fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6,
            padding: '16px', background: 'var(--surface-1)',
            borderRadius: '12px', border: '0.5px solid var(--border-subtle)',
            marginBottom: '28px'
          }}>
            {event.description}
          </div>
        )}

        {/* Ticket tiers */}
        <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '16px' }}>
          Select tickets
        </div>

        {!tiers || tiers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '14px' }}>
            No tickets available
          </div>
        ) : (
          <EventBookingForm
            tiers={tiers}
            userId={user?.id ?? null}
            eventId={event.id}
            startTime={event.start_time}
          />
        )}
      </div>
    </main>
  )
}