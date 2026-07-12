'use client'
import VenueCard from '@/components/VenueCard'

const tabLabels: Record<string, string> = {
  dining: 'Dining',
  movies: 'Movies',
  events: 'Events',
  sports: 'Sports',
  staycation: 'Staycations',
}

function IconEmpty() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', opacity: 0.3 }}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export default function HomeVenues({
  venues,
  activeCategory,
}: {
  venues: any[]
  activeCategory?: string | null
}) {
  const heading = activeCategory
    ? `${tabLabels[activeCategory] ?? activeCategory} near you`
    : 'Top rated near you'

  return (
    <div style={{ padding: '0 24px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff' }}>{heading}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{venues.length} places</div>
      </div>
      {venues.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '48px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
        }}>
          <IconEmpty />
          <div style={{ fontSize: '15px', color: 'var(--text-muted)' }}>No venues found</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', opacity: 0.6 }}>Try a different search or adjust filters</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {venues.map(venue => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  )
}
