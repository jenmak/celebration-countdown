import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

export async function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const JWKS = jose.createRemoteJWKSet(
      new URL(`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/.well-known/jwks.json`)
    )

    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/`,
      audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE
    })

    // Add the user to the request headers for use in API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.sub as string)
    requestHeaders.set('x-user-email', payload.email as string)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}

export const config = {
  matcher: '/api/:path*',
} 