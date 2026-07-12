'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function IconPin() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconChevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function CityPicker({
  cities,
  currentCityName,
  currentCityId,
  userId,
}: {
  cities: { id: string; name: string }[] | null
  currentCityName: string | null
  currentCityId: string | null
  userId: string | null
}) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(currentCityId)
  const [selectedName, setSelectedName] = useState(currentCityName)
  const [saving, setSaving] = useState(false)

  async function selectCity(city: { id: string; name: string }) {
    if (city.id === selectedId) { setOpen(false); return }
    
    // Optimistic UI — update immediately
    setSelectedId(city.id)
    setSelectedName(city.name)
    setOpen(false)
    
    // Sync to DB in background
    if (userId) {
      setSaving(true)
      await supabase
        .from('profiles')
        .update({ city_id: city.id })
        .eq('id', userId)
      setSaving(false)
    }
  }

  const displayName = saving ? 'Saving...' : (selectedName ?? 'Select city')

  return (
    <>
      {/* City pill */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'var(--surface-1)', border: '0.5px solid var(--border-default)',
          borderRadius: '20px', padding: '6px 12px 6px 10px',
          fontSize: '13px', color: '#ccc', cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <span style={{ color: 'var(--vayo-accent)', display: 'flex' }}><IconPin /></span>
        <span>{displayName}</span>
        <span style={{ color: 'var(--text-muted)', display: 'flex' }}><IconChevron /></span>
      </button>

      {/* Bottom sheet */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
            zIndex: 200, display: 'flex', alignItems: 'flex-end',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', background: 'var(--surface-1)',
              borderRadius: '20px 20px 0 0', padding: '20px 0 40px',
              border: '0.5px solid var(--border-default)',
            }}
          >
            {/* Handle */}
            <div style={{
              width: '40px', height: '4px', background: 'var(--border-default)',
              borderRadius: '2px', margin: '0 auto 20px',
            }} />

            <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', padding: '0 24px', marginBottom: '6px' }}>
              Choose your city
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '0 24px', marginBottom: '20px' }}>
              Venues, movies and events will update automatically
            </div>

            {/* City list */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {(cities ?? []).map(city => {
                const isActive = city.id === selectedId
                return (
                  <button
                    key={city.id}
                    onClick={() => selectCity(city)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 24px', background: 'none', border: 'none',
                      borderBottom: '0.5px solid var(--border-subtle)',
                      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: isActive ? 'var(--vayo-accent-muted)' : 'var(--surface-2)',
                        border: isActive ? '0.5px solid var(--vayo-accent-border)' : '0.5px solid var(--border-default)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isActive ? 'var(--vayo-accent)' : 'var(--text-muted)',
                      }}>
                        <IconPin />
                      </div>
                      <span style={{
                        fontSize: '15px', fontWeight: isActive ? 600 : 400,
                        color: isActive ? '#fff' : '#ccc',
                      }}>
                        {city.name}
                      </span>
                    </div>
                    {isActive && (
                      <span style={{ color: 'var(--vayo-accent)' }}><IconCheck /></span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Live location — coming soon */}
            <div style={{ padding: '20px 24px 0' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 16px', borderRadius: '12px',
                background: 'var(--surface-2)', border: '0.5px solid var(--border-default)',
                opacity: 0.5,
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'var(--vayo-accent-muted)', border: '0.5px solid var(--vayo-accent-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--vayo-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>Use live location</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Coming soon</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
