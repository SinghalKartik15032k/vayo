import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (!booking) return notFound()

  const bookingDate = new Date(booking.booking_time)
  const dateStr = bookingDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const timeStr = bookingDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <main style={{
      background: 'var(--background)', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '24px'
    }}>
      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)',
        borderRadius: '20px', padding: '32px 24px', textAlign: 'center'
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'var(--vayo-accent-muted)', border: '1.5px solid var(--vayo-accent-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', margin: '0 auto 20px', color: 'var(--vayo-accent)'
        }}>
          ✓
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 500, color: '#fff', marginBottom: '8px', letterSpacing: '-0.3px' }}>
          You&apos;re confirmed!
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px' }}>
          Your reservation has been booked successfully.
        </p>

        <div style={{
          background: 'var(--surface-2)', borderRadius: '12px',
          padding: '16px', marginBottom: '28px', textAlign: 'left'
        }}>
          {[
            { label: 'Booking ID', value: `#${booking.id.slice(0, 8).toUpperCase()}` },
            { label: 'Date', value: dateStr },
            { label: 'Time', value: timeStr },
            { label: 'Guests', value: `${booking.quantity} ${booking.quantity === 1 ? 'guest' : 'guests'}` },
            { label: 'Status', value: '✓ Confirmed' },
          ].map(row => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: '0.5px solid var(--border-subtle)'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{row.label}</span>
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>{row.value}</span>
            </div>
          ))}
        </div>

        <Link href="/" style={{
          display: 'block', width: '100%', padding: '14px',
          background: 'var(--vayo-accent)', color: '#0a0a0a',
          borderRadius: '12px', fontWeight: 600, fontSize: '15px',
          textDecoration: 'none', textAlign: 'center'
        }}>
          Back to home
        </Link>
      </div>
    </main>
  )
}