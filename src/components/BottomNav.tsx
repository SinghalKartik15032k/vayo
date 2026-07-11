'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { icon: '🏠', label: 'Home',     href: '/' },
  { icon: '🧭', label: 'Explore',  href: '/explore' },
  { icon: '🎟', label: 'Bookings', href: '/bookings' },
  { icon: '❤️', label: 'Saved',    href: '/favorites' },
  { icon: '👤', label: 'Profile',  href: '/profile' },
]

export default function BottomNav() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div style={{
      position: 'sticky', bottom: 0,
      background: 'var(--surface-1)', borderTop: '0.5px solid var(--border-subtle)',
      display: 'flex', justifyContent: 'space-around', padding: '10px 0 16px'
    }}>
      {navItems.map(item => {
        const active = isActive(item.href)
        return (
          <Link key={item.label} href={item.href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            fontSize: '10px', color: active ? 'var(--vayo-accent)' : 'var(--text-muted)',
            cursor: 'pointer', textDecoration: 'none'
          }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
