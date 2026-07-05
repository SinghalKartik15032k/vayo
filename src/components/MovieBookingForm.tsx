'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function MovieBookingForm({
  showtimeId,
  userId,
  movieId,
  pricePerTicket,
  seatsAvailable,
  startTime,
}: {
  showtimeId: string
  userId: string
  movieId: string
  pricePerTicket: number
  seatsAvailable: number
  startTime: string
}) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalAmount = quantity * pricePerTicket

  async function handleBooking() {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        booking_type: 'movie',
        reference_id: showtimeId,
        booking_time: startTime,
        quantity,
        status: 'confirmed',
        total_amount: totalAmount,
      })
      .select()
      .single()

    if (error) { setError(error.message); setLoading(false); return }

    router.push(`/bookings/${data.id}/confirmation`)
  }

  return (
    <div style={{ padding: '0 24px 40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Ticket quantity */}
      <div>
        <div style={{
          fontSize: '12px', color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px'
        }}>
          Number of tickets
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            style={{
              width: '48px', height: '48px', borderRadius: '50%', fontSize: '22px',
              background: 'var(--surface-1)', border: '0.5px solid var(--border-default)',
              color: '#fff', cursor: 'pointer'
            }}
          >−</button>
          <span style={{ fontSize: '28px', fontWeight: 500, color: '#fff', minWidth: '32px', textAlign: 'center' }}>
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(q => Math.min(seatsAvailable, q + 1))}
            style={{
              width: '48px', height: '48px', borderRadius: '50%', fontSize: '22px',
              background: 'var(--surface-1)', border: '0.5px solid var(--border-default)',
              color: '#fff', cursor: 'pointer'
            }}
          >+</button>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {quantity === 1 ? 'ticket' : 'tickets'}
          </span>
        </div>
      </div>

      {/* Price breakdown */}
      <div style={{
        background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)',
        borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px'
      }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Price summary
        </div>
        {[
          { label: `₹${pricePerTicket} × ${quantity} ticket${quantity > 1 ? 's' : ''}`, value: `₹${totalAmount}` },
          { label: 'Convenience fee', value: '₹0' },
          { label: 'Total', value: `₹${totalAmount}`, bold: true },
        ].map(row => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: row.bold ? '10px' : '0',
            borderTop: row.bold ? '0.5px solid var(--border-subtle)' : 'none'
          }}>
            <span style={{ fontSize: '13px', color: row.bold ? '#fff' : 'var(--text-muted)', fontWeight: row.bold ? 500 : 400 }}>
              {row.label}
            </span>
            <span style={{ fontSize: row.bold ? '16px' : '13px', color: row.bold ? 'var(--vayo-accent)' : '#fff', fontWeight: row.bold ? 600 : 400 }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ fontSize: '13px', color: '#ff6b6b', padding: '12px 16px', background: 'rgba(255,107,107,0.1)', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {/* Confirm button */}
      <button
        onClick={handleBooking}
        disabled={loading}
        style={{
          width: '100%', padding: '16px',
          background: loading ? 'var(--surface-2)' : 'var(--vayo-accent)',
          color: loading ? 'var(--text-muted)' : '#0a0a0a',
          border: 'none', borderRadius: '14px',
          fontSize: '16px', fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Booking…' : `Pay ₹${totalAmount}`}
      </button>

    </div>
  )
}