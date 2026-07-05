'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BookingForm({ venueId, userId }: { venueId: string, userId: string }) {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [quantity, setQuantity] = useState(2)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ]

  async function handleBooking() {
    if (!date || !time) { setError('Please select a date and time'); return }
    setLoading(true)
    setError(null)

    const bookingTimestamp = new Date(`${date}T${time}:00`).toISOString()

    const supabase = createClient()
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        booking_type: 'dining',
        reference_id: venueId,
        booking_time: bookingTimestamp,
        quantity: quantity,
        status: 'confirmed',
        total_amount: 0,
      })
      .select()
      .single()

    if (error) { setError(error.message); setLoading(false); return }

    router.push(`/bookings/${data.id}/confirmation`)
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    background: 'var(--surface-1)', border: '0.5px solid var(--border-default)',
    borderRadius: '12px', fontSize: '15px', color: '#fff',
    outline: 'none', appearance: 'none' as const
  }

  const labelStyle = {
    display: 'block', fontSize: '12px', color: 'var(--text-muted)',
    textTransform: 'uppercase' as const, letterSpacing: '0.8px', marginBottom: '8px'
  }

  return (
    <div style={{ padding: '0 24px 40px', display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>

      {/* Date */}
      <div>
        <label style={labelStyle}>Date</label>
        <input
          type="date"
          value={date}
          min={new Date().toISOString().split('T')[0]}
          onChange={e => setDate(e.target.value)}
          style={{ ...inputStyle, colorScheme: 'dark' }}
        />
      </div>

      {/* Time slots */}
      <div>
        <label style={labelStyle}>Time</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {timeSlots.map(slot => (
            <button
              key={slot}
              onClick={() => setTime(slot)}
              style={{
                padding: '10px 4px', borderRadius: '10px', fontSize: '13px',
                cursor: 'pointer', fontWeight: time === slot ? 600 : 400,
                background: time === slot ? 'var(--vayo-accent)' : 'var(--surface-1)',
                color: time === slot ? '#0a0a0a' : 'var(--text-muted)',
                border: time === slot ? 'none' : '0.5px solid var(--border-default)',
              }}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label style={labelStyle}>Party size</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            style={{
              width: '44px', height: '44px', borderRadius: '50%', fontSize: '20px',
              background: 'var(--surface-1)', border: '0.5px solid var(--border-default)',
              color: '#fff', cursor: 'pointer'
            }}
          >−</button>
          <span style={{ fontSize: '24px', fontWeight: 500, color: '#fff', minWidth: '32px', textAlign: 'center' }}>
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(q => Math.min(20, q + 1))}
            style={{
              width: '44px', height: '44px', borderRadius: '50%', fontSize: '20px',
              background: 'var(--surface-1)', border: '0.5px solid var(--border-default)',
              color: '#fff', cursor: 'pointer'
            }}
          >+</button>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {quantity === 1 ? 'guest' : 'guests'}
          </span>
        </div>
      </div>

      {error && (
        <div style={{ fontSize: '13px', color: '#ff6b6b', padding: '12px 16px', background: 'rgba(255,107,107,0.1)', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleBooking}
        disabled={loading}
        style={{
          width: '100%', padding: '16px',
          background: loading ? 'var(--surface-2)' : 'var(--vayo-accent)',
          color: loading ? 'var(--text-muted)' : '#0a0a0a',
          border: 'none', borderRadius: '14px',
          fontSize: '16px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Confirming…' : 'Confirm reservation'}
      </button>
    </div>
  )
}