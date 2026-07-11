import Link from 'next/link'

const categoryIcons: Record<string, string> = {
  dining: '🍽',
  movies: '🎬',
  events: '🎉',
  sports: '⚽',
  staycation: '🏨',
  shopping: '🛍',
}

export default function VenueCard({ venue }: { venue: any }) {
  return (
    <Link href={`/venues/${venue.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)',
        borderRadius: '14px', overflow: 'hidden', cursor: 'pointer'
      }}>
        <div style={{
          height: '100px', background: 'var(--surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative'
        }}>
          <span style={{ fontSize: '32px', opacity: 0.3 }}>
            {categoryIcons[venue.category] ?? '📍'}
          </span>
          <div style={{
            position: 'absolute', bottom: '8px', left: '8px',
            background: 'var(--vayo-accent-muted)', border: '0.5px solid var(--vayo-accent-border)',
            borderRadius: '6px', padding: '3px 8px', fontSize: '10px',
            color: 'var(--vayo-accent)', textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            {venue.category}
          </div>
          {venue.rating_avg && (
            <div style={{
              position: 'absolute', bottom: '8px', right: '8px',
              background: 'rgba(0,0,0,0.6)', borderRadius: '6px',
              padding: '3px 8px', fontSize: '11px', color: '#ffd700'
            }}>
              ★ {venue.rating_avg}
            </div>
          )}
        </div>
        <div style={{ padding: '10px 12px 12px' }}>
          <div style={{
            fontSize: '14px', fontWeight: 500, color: '#fff',
            marginBottom: '4px', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {venue.name}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            📍 {venue.cities?.name ?? venue.address}
          </div>
        </div>
      </div>
    </Link>
  )
}
