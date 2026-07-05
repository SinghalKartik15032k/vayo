'use client'

import { useRouter } from 'next/navigation'

export default function BookButton({ venue }: { venue: any }) {
  const router = useRouter()

  const labels: Record<string, string> = {
    dining: 'Reserve a table',
    movies: 'Book tickets',
    events: 'Get tickets',
    sports: 'Book a slot',
    staycation: 'Check availability',
    shopping: 'Explore',
  }

  return (
    <button
      onClick={() => router.push(`/venues/${venue.id}/book`)}
      style={{
        width: '100%', padding: '16px',
        background: 'var(--vayo-accent)', color: '#0a0a0a',
        border: 'none', borderRadius: '14px',
        fontSize: '16px', fontWeight: 600, cursor: 'pointer',
        letterSpacing: '-0.2px'
      }}
    >
      {labels[venue.category] ?? 'Book now'}
    </button>
  )
}