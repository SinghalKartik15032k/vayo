import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/profile')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: cities } = await supabase
    .from('cities')
    .select('id, name')
    .order('name', { ascending: true })

  if (!profile) redirect('/login')

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <div style={{
        padding: '18px 24px',
        borderBottom: '0.5px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '20px' }}>←</Link>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>Profile</span>
        <div style={{ width: '20px' }} />
      </div>

      <ProfileForm
        profile={profile}
        cities={cities ?? []}
        email={user.email ?? ''}
      />
    </main>
  )
}
