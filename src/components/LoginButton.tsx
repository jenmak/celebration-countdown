'use client'

import { useAuth0 } from '@auth0/auth0-react'
import { Button } from '@chakra-ui/react'

export default function LoginButton() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0()

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.name}!</p>
        <Button
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          colorScheme="blue"
          variant="outline"
        >
          Log Out
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => loginWithRedirect()}
      colorScheme="blue"
    >
      Log In
    </Button>
  )
} 