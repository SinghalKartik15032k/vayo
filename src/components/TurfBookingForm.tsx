'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Slot = {
  id: string
  sport_type: string
  start_time: string
  end_time: string
  price: number
  is_booked: boolean
}

export default function TurfBookingForm({
  slots,
  userId,
  venueId,
}: {
  slots: Slot[]
  userId: string | null
  venueId: string
}) {
  const router = useRouter()
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleBooking() {
    if (!selectedSlot) { setError('Please select a slot'); return }
    if (!userId) { router.push(`/login?next=/sports/${venueId}`); return }

    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        booking_type: 'turf',
        reference_id: selectedSlot.id,
        booking_time: selectedSlot.start_time,
        quantity: 1,
        status: 'confirmed',
        total_amount: selectedSlot.price,
      })
      .select()
      .single()

    if (error) { setError(error.message); setLoading(false); return }

    // Mark slot as booked
    await supabase
      .from('turf_slots')
      .update({ is_booked: true })
      .eq('id', selectedSlot.id)

    router.push(`/bookings/${data.id}/confirmation`)
  }

  // Group slots by date
  const grouped = slots.reduce((acc, slot) => {
    const date = new Date(slot.start_time).toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short'
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(slot)
    return acc
  }, {} as Record<string, Slot[]>)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Slots grouped by date */}
      {Object.entries(grouped).map(([date, dateSlots]) => (
        <div key={date}>
          <div style={{
            fontSize: '12px', color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.8px',
            marginBottom: '10px'
          }}>
            {date}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {dateSlots.map(slot => {
              const start = new Date(slot.start_time)
              const end = new Date(slot.end_time)
              const timeStr = `${start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
              const durationMs = end.getTime() - start.getTime()
              const durationHrs = durationMs / (1000 * 60 * 60)
              const selected = selectedSlot?.id === slot.id

              return (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  style={{
                    padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                    background: selected ? 'var(--vayo-accent-muted)' : 'var(--surface-1)',
                    border: selected ? '1.5px solid var(--vayo-accent)' : '0.5px solid var(--border-subtle)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '3px' }}>
                      {timeStr}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {slot.sport_type} · {durationHrs}h
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: selected ? 'var(--vayo-accent)' : '#fff' }}>
                      ₹{slot.price}
                    </div>
                    {selected && (
                      <div style={{ fontSize: '11px', color: 'var(--vayo-accent)', marginTop: '2px' }}>Selected ✓</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Summary */}
      {selectedSlot && (
        <div style={{
          background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)',
          borderRadius: '14px', padding: '16px', display: 'flex', justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Total</span>
          <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--vayo-accent)' }}>
            ₹{selectedSlot.price}
          </span>
        </div>
      )}

      {error && (
        <div style={{ fontSize: '13px', color: '#ff6b6b', padding: '12px 16px', background: 'rgba(255,107,107,0.1)', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleBooking}
        disabled={loading || !selectedSlot}
        style={{
          width: '100%', padding: '16px',
          background: !selectedSlot || loading ? 'var(--surface-2)' : 'var(--vayo-accent)',
          color: !selectedSlot || loading ? 'var(--text-muted)' : '#0a0a0a',
          border: 'none', borderRadius: '14px',
          fontSize: '16px', fontWeight: 600,
          cursor: !selectedSlot || loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Booking…' : selectedSlot ? `Confirm · ₹${selectedSlot.price}` : 'Select a slot to continue'}
      </button>
    </div>
  )
}