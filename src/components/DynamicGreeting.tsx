'use client'
import { useEffect, useState } from 'react'

interface Props {
  name: string | null
  city: string | null
}

function getTimeContext() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return {
    greeting: 'Good morning',
    hero1: "What's the plan",
    hero2: 'today?',
    sub: 'Brunch · Movies · Events · Sports · Staycations',
    emoji: '☀️',
  }
  if (hour >= 12 && hour < 17) return {
    greeting: 'Good afternoon',
    hero1: "What's on",
    hero2: 'the agenda?',
    sub: 'Dining · Movies · Events · Sports · Staycations',
    emoji: '🌤️',
  }
  if (hour >= 17 && hour < 21) return {
    greeting: 'Good evening',
    hero1: "What's the plan",
    hero2: 'tonight?',
    sub: 'Dining · Movies · Events · Sports · Staycations',
    emoji: '🌆',
  }
  return {
    greeting: 'Still up?',
    hero1: 'Night owl mode.',
    hero2: "Let's find something.",
    sub: 'Late night · Movies · Events · Staycations',
    emoji: '🌙',
  }
}

export default function DynamicGreeting({ name, city }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return <div style={{ padding: '32px 24px 24px', height: '120px' }} />

  const { greeting, hero1, hero2, sub, emoji } = getTimeContext()
  const displayName = name?.split(' ')[0] ?? null

  return (
    <div style={{ padding: '32px 24px 20px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: 'var(--surface-1)', border: '0.5px solid var(--border-default)',
        borderRadius: '20px', padding: '5px 12px', marginBottom: '16px'
      }}>
        <span style={{ fontSize: '13px' }}>{emoji}</span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {greeting}{displayName ? `, ${displayName}` : ''}
        </span>
      </div>
      <div style={{
        fontSize: '32px', fontWeight: 500, lineHeight: 1.2,
        letterSpacing: '-0.5px', color: '#fff', marginBottom: '8px'
      }}>
        {hero1}<br />
        <span style={{ color: 'var(--vayo-accent)' }}>{hero2}</span>
      </div>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        {sub}
      </div>
    </div>
  )
}
