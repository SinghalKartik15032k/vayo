import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BookButton from '@/components/BookButton'

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: venue } = await supabase
    .from('venues')
    .select('*, cities(name)')
    .eq('id', id)
    .single()

  if (!venue) return notFound()

  const categoryIcons: Record<string, string> = {
    dining: '🍽', movies: '🎬', events: '🎉',
    sports: '⚽', staycation: '🏨', shopping: '🛍',
  }

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh' }}>

      {/* Back nav */}
      <div style={{
        padding: '18px 24px', borderBottom: '0.5px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '20px' }}>←</Link>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>{venue.name}</span>
      </div>

      {/* Hero image placeholder */}
      <div style={{
        height: '220px', background: 'var(--surface-1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative'
      }}>
        <span style={{ fontSize: '72px', opacity: 0.15 }}>
          {categoryIcons[venue.category] ?? '📍'}
        </span>
        <div style={{
          position: 'absolute', bottom: '16px', left: '24px',
          background: 'var(--vayo-accent-muted)', border: '0.5px solid var(--vayo-accent-border)',
          borderRadius: '6px', padding: '4px 10px', fontSize: '11px',
          color: 'var(--vayo-accent)', textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          {venue.category}
        </div>
        {venue.rating_avg && (
          <div style={{
            position: 'absolute', bottom: '16px', right: '24px',
            background: 'rgba(0,0,0,0.7)', borderRadius: '8px',
            padding: '6px 12px', fontSize: '14px', color: '#ffd700', fontWeight: 500
          }}>
            ★ {venue.rating_avg}
          </div>
        )}
      </div>

      {/* Venue info */}
      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 500, color: '#fff', marginBottom: '8px', letterSpacing: '-0.5px' }}>
          {venue.name}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            📍 {venue.address}{venue.cities?.name ? `, ${venue.cities.name}` : ''}
          </div>
          {venue.phone && (
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>📞 {venue.phone}</div>
          )}
          {venue.website_url && (
            <div style={{ fontSize: '14px', color: 'var(--vayo-accent)' }}>🌐 {venue.website_url}</div>
          )}
          {venue.opening_hours && (
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>🕐 {venue.opening_hours}</div>
          )}
        </div>

        {venue.description && (
          <div style={{
            fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6,
            marginBottom: '28px', padding: '16px', background: 'var(--surface-1)',
            borderRadius: '12px', border: '0.5px solid var(--border-subtle)'
          }}>
            {venue.description}
          </div>
        )}

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px', marginBottom: '32px'
        }}>
          {[
            { label: 'Rating', value: venue.rating_avg ? `★ ${venue.rating_avg}` : '—' },
            { label: 'City', value: venue.cities?.name ?? '—' },
            { label: 'Category', value: venue.category ?? '—' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)',
              borderRadius: '12px', padding: '14px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Book button — client component */}
        <BookButton venue={venue} />
      </div>
    </main>
  )
}