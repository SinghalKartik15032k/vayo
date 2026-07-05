import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getSession()

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Vayo 🚀</h1>
      <p>Supabase connection: {error ? '❌ ' + error.message : '✅ Connected'}</p>
    </main>
  )
}
