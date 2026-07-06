import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function EventsPage() {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from('events')
    .select('*, venues(name, address, cities(name))')
    .gte('end_time', new Date().toISOString())
    .order('start_time', { ascending: true })

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh' }}>

      <div style={{
        padding: '18px 24px',
        borderBottom: '0.5px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '20px' }}>←</Link>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>Events</span>
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {!events || events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            No upcoming events
          </div>
        ) : events.map(event => {
          const start = new Date(event.start_time)
          const dateStr = start.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
          const timeStr = start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

          return (
            <Link key={event.id} href={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)',
                borderRadius: '16px', overflow: 'hidden'
              }}>
                {/* Image placeholder */}
                <div style={{
                  height: '140px', background: 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '48px', opacity: 0.2, position: 'relative'
                }}>
                  🎉
                  <div style={{
                    position: 'absolute', top: '12px', left: '12px',
                    background: 'var(--vayo-accent)', color: '#0a0a0a',
                    borderRadius: '6px', padding: '4px 10px',
                    fontSize: '11px', fontWeight: 600
                  }}>
                    {event.category}
                  </div>
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '17px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>
                    {event.title}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    📍 {event.venues?.name} · {event.venues?.cities?.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    📅 {dateStr} · {timeStr}
                  </div>
                  {event.description && (
                    <div style={{
                      fontSize: '13px', color: 'var(--text-secondary)',
                      lineHeight: 1.5, marginBottom: '14px',
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const, overflow: 'hidden'
                    }}>
                      {event.description}
                    </div>
                  )}
                  <div style={{
                    display: 'inline-block', padding: '7px 16px',
                    background: 'var(--vayo-accent)', color: '#0a0a0a',
                    borderRadius: '8px', fontSize: '13px', fontWeight: 600
                  }}>
                    Get tickets
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}