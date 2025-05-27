'use client'

import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { Auth0Provider } from '@auth0/auth0-react'

export function Providers({ children }: { children: React.ReactNode }) {
  console.log('Auth0 Config:', {
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE
  })

  if (!process.env.NEXT_PUBLIC_AUTH0_DOMAIN || !process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || !process.env.NEXT_PUBLIC_AUTH0_AUDIENCE) {
    console.error('Missing required Auth0 environment variables')
  }

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ''}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ''}
      authorizationParams={{
        redirect_uri: 'http://localhost:3000',
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        scope: 'openid profile email'
      }}
    >
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </Auth0Provider>
  )
} 