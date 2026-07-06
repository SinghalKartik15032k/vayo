'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Tier = {
  id: string
  tier_name: string
  price: number
  quantity_available: number
}

export default function EventBookingForm({
  tiers,
  userId,
  eventId,
  startTime,
}: {
  tiers: Tier[]
  userId: string | null
  eventId: string
  startTime: string
}) {
  const router = useRouter()
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalAmount = selectedTier ? selectedTier.price * quantity : 0

  async function handleBooking() {
    if (!selectedTier) { setError('Please select a ticket tier'); return }
    if (!userId) { router.push(`/login?next=/events/${eventId}`); return }

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        booking_type: 'event',
        reference_id: selectedTier.id,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Tier selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tiers.map(tier => {
          const soldOut = tier.quantity_available === 0
          const selected = selectedTier?.id === tier.id

          return (
            <div
              key={tier.id}
              onClick={() => { if (!soldOut) { setSelectedTier(tier); setQuantity(1) } }}
              style={{
                padding: '16px', borderRadius: '14px', cursor: soldOut ? 'not-allowed' : 'pointer',
                opacity: soldOut ? 0.5 : 1,
                background: selected ? 'var(--vayo-accent-muted)' : 'var(--surface-1)',
                border: selected ? '1.5px solid var(--vayo-accent)' : '0.5px solid var(--border-subtle)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '15px', fontWeight: 500, color: '#fff', marginBottom: '4px' }}>
                  {tier.tier_name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {soldOut ? 'Sold out' : `${tier.quantity_available} available`}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 600, color: selected ? 'var(--vayo-accent)' : '#fff' }}>
                  ₹{tier.price}
                </div>
                {selected && (
                  <div style={{ fontSize: '11px', color: 'var(--vayo-accent)', marginTop: '2px' }}>Selected ✓</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quantity — only show once a tier is selected */}
      {selectedTier && (
        <div>
          <div style={{
            fontSize: '12px', color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px'
          }}>
            Quantity
          </div>
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
              onClick={() => setQuantity(q => Math.min(selectedTier.quantity_available, q + 1))}
              style={{
                width: '44px', height: '44px', borderRadius: '50%', fontSize: '20px',
                background: 'var(--surface-1)', border: '0.5px solid var(--border-default)',
                color: '#fff', cursor: 'pointer'
              }}
            >+</button>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              {quantity === 1 ? 'ticket' : 'tickets'}
            </span>
          </div>
        </div>
      )}

      {/* Price summary */}
      {selectedTier && (
        <div style={{
          background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)',
          borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Price summary
          </div>
          {[
            { label: `₹${selectedTier.price} × ${quantity} ticket${quantity > 1 ? 's' : ''}`, value: `₹${totalAmount}` },
            { label: 'Convenience fee', value: '₹0' },
            { label: 'Total', value: `₹${totalAmount}`, bold: true },
          ].map(row => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between',
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
      )}

      {error && (
        <div style={{ fontSize: '13px', color: '#ff6b6b', padding: '12px 16px', background: 'rgba(255,107,107,0.1)', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleBooking}
        disabled={loading || !selectedTier}
        style={{
          width: '100%', padding: '16px',
          background: !selectedTier || loading ? 'var(--surface-2)' : 'var(--vayo-accent)',
          color: !selectedTier || loading ? 'var(--text-muted)' : '#0a0a0a',
          border: 'none', borderRadius: '14px',
          fontSize: '16px', fontWeight: 600,
          cursor: !selectedTier || loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Booking…' : selectedTier ? `Pay ₹${totalAmount}` : 'Select a tier to continue'}
      </button>
    </div>
  )
}