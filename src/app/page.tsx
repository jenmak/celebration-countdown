'use client'

import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from '../components/LoginButton'

export default function Home() {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Celebration Countdown</h1>
        <LoginButton />
      </div>
    </main>
  )
} 