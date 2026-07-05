import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function MoviesPage() {
  const supabase = await createClient()

  const { data: movies } = await supabase
    .from('movies')
    .select('*')
    .order('release_date', { ascending: false })

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh' }}>

      {/* Nav */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '0.5px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '20px' }}>←</Link>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>Movies</span>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {movies?.map(movie => (
            <Link key={movie.id} href={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--surface-1)', border: '0.5px solid var(--border-subtle)',
                borderRadius: '16px', overflow: 'hidden', display: 'flex', gap: '0'
              }}>
                {/* Poster placeholder */}
                <div style={{
                  width: '100px', minHeight: '140px', background: 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: '36px', opacity: 0.3
                }}>
                  🎬
                </div>

                {/* Info */}
                <div style={{ padding: '16px', flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>
                    {movie.title}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    {movie.genre?.map((g: string) => (
                      <span key={g} style={{
                        padding: '2px 8px', borderRadius: '20px', fontSize: '11px',
                        background: 'var(--vayo-accent-muted)', color: 'var(--vayo-accent)',
                        border: '0.5px solid var(--vayo-accent-border)'
                      }}>{g}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      🌐 {movie.language} · ⏱ {movie.duration_min} min
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      📅 {new Date(movie.release_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{
                    marginTop: '12px', display: 'inline-block',
                    padding: '6px 14px', background: 'var(--vayo-accent)',
                    color: '#0a0a0a', borderRadius: '8px', fontSize: '12px', fontWeight: 600
                  }}>
                    Book tickets
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}