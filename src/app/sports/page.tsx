import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function SportsPage() {
  const supabase = await createClient()

  const { data: venues } = await supabase
    .from('venues')
    .select('*, cities(name)')
    .eq('category', 'sports')
    .order('rating_avg', { ascending: false })

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh' }}>

      <div style={{
        padding: '18px 24px',
        borderBottom: '0.5px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '20px' }}>←</Link>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>Sports & Turfs</span>
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {!venues || venues.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            No sports venues available
          </div>
        ) : venues.map(venue => (
          <Link key={venue.id} href={`/sports/${venue.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)',
              borderRadius: '16px', overflow: 'hidden', display: 'flex'
            }}>
              <div style={{
                width: '100px', minHeight: '130px', background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '36px', opacity: 0.25, flexShrink: 0
              }}>
                ⚽
              </div>
              <div style={{ padding: '16px', flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>
                  {venue.name}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  📍 {venue.address}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  🏙 {venue.cities?.name}
                  {venue.rating_avg && ` · ★ ${venue.rating_avg}`}
                </div>
                <div style={{
                  display: 'inline-block', padding: '6px 14px',
                  background: 'var(--vayo-accent)', color: '#0a0a0a',
                  borderRadius: '8px', fontSize: '12px', fontWeight: 600
                }}>
                  View slots
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}