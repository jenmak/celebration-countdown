import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authApi, type AuthUser, type Session } from '../api/auth'
import {
  clearStoredSession,
  loadStoredSession,
  saveStoredSession,
} from './storage'

type AuthContextValue = {
  status: 'loading' | 'signedIn' | 'signedOut'
  user: AuthUser | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<AuthContextValue['status']>('loading')

  useEffect(() => {
    let cancelled = false

    async function restore() {
      const stored = await loadStoredSession()
      if (!stored?.refreshToken) {
        if (!cancelled) setStatus('signedOut')
        return
      }

      // Access tokens are short lived, so trade the refresh token for a fresh one.
      try {
        const refreshed = await authApi.refresh({
          refreshToken: stored.refreshToken,
        })
        const next = { ...refreshed, refreshToken: stored.refreshToken }
        await saveStoredSession(next)
        if (cancelled) return
        setSession(next)
        setStatus('signedIn')
      } catch {
        await clearStoredSession()
        if (!cancelled) setStatus('signedOut')
      }
    }

    void restore()
    return () => {
      cancelled = true
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const next = await authApi.login({ email, password })
    await saveStoredSession(next)
    setSession(next)
    setStatus('signedIn')
  }, [])

  const signOut = useCallback(async () => {
    const token = session?.accessToken
    setSession(null)
    setStatus('signedOut')
    await clearStoredSession()
    if (token) {
      try {
        await authApi.logout(token)
      } catch {
        // Local sign-out already happened; a failed revoke shouldn't block it.
      }
    }
  }, [session?.accessToken])

  const value = useMemo<AuthContextValue>(
    () => ({ status, user: session?.user ?? null, signIn, signOut }),
    [status, session?.user, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}
