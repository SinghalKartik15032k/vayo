'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface City { id: string; name: string }
interface Profile { id: string; full_name: string | null; phone: string | null; city_id: string | null; role: string }

export default function ProfileForm({ profile, cities, email }: { profile: Profile; cities: City[]; email: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [fullName, setFullName] = useState(profile.full_name ?? '')
  const [phone, setPhone] = useState(profile.phone ?? '')
  const [cityId, setCityId] = useState(profile.city_id ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const initials = (fullName || email).slice(0, 2).toUpperCase()

  async function handleSave() {
    setLoading(true)
    setError(null)
    setSuccess(false)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone, city_id: cityId || null, updated_at: new Date().toISOString() })
      .eq('id', profile.id)
    setLoading(false)
    if (error) { setError(error.message); return }
    setSuccess(true)
    router.refresh()
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    background: 'var(--surface-2)', border: '0.5px solid var(--border-default)',
    borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    fontSize: '11px', color: 'var(--text-muted)',
    textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '6px', display: 'block'
  }

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'var(--vayo-accent)', color: '#0a0a0a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', fontWeight: 700, flexShrink: 0
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>{fullName || 'Your Name'}</div>
          <div style={{
            marginTop: '4px', display: 'inline-block',
            padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500,
            background: 'var(--vayo-accent-muted)', color: 'var(--vayo-accent)',
            border: '0.5px solid var(--vayo-accent-border)', textTransform: 'capitalize'
          }}>
            {profile.role}
          </div>
        </div>
      </div>

      {/* Email (read-only) */}
      <div style={{ background: 'var(--surface-1)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', borderBottom: '0.5px solid var(--border-subtle)', paddingBottom: '12px' }}>
          Account Info
        </div>
        <div>
          <label style={labelStyle}>Email</label>
          <div style={{ ...inputStyle, color: 'var(--text-muted)', cursor: 'not-allowed' }}>{email}</div>
        </div>
      </div>

      {/* Editable fields */}
      <div style={{ background: 'var(--surface-1)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', borderBottom: '0.5px solid var(--border-subtle)', paddingBottom: '12px' }}>
          Personal Details
        </div>

        <div>
          <label style={labelStyle}>Full Name</label>
          <input
            style={inputStyle}
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div>
          <label style={labelStyle}>Phone</label>
          <input
            style={inputStyle}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+91 XXXXX XXXXX"
            type="tel"
          />
        </div>

        <div>
          <label style={labelStyle}>City</label>
          <select
            style={{ ...inputStyle, appearance: 'none' as const }}
            value={cityId}
            onChange={e => setCityId(e.target.value)}
          >
            <option value="">Select city</option>
            {cities.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 14px', background: '#ef444420', border: '0.5px solid #ef444440', borderRadius: '10px', color: '#ef4444', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ padding: '12px 14px', background: 'var(--vayo-accent-muted)', border: '0.5px solid var(--vayo-accent-border)', borderRadius: '10px', color: 'var(--vayo-accent)', fontSize: '13px' }}>
          Profile updated successfully
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          padding: '14px', background: loading ? 'var(--surface-2)' : 'var(--vayo-accent)',
          color: loading ? 'var(--text-muted)' : '#0a0a0a',
          border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
        }}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )
}
