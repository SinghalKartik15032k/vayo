import { NextResponse, type NextRequest } from 'next/server'

const protectedRoutes = ['/profile', '/bookings', '/favorites']
const authRoutes = ['/login', '/signup']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasSession = request.cookies.getAll().some(
    cookie => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
  )

  if (!hasSession && protectedRoutes.some(route => pathname.startsWith(route))) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (hasSession && authRoutes.some(route => pathname.startsWith(route))) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
