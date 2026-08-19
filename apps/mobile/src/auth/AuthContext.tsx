import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { authApi, type AuthUser, type Session } from '../api/auth'
import {
  ApiError,
  apiRequest,
  type AuthorizedRequest,
  type RequestOptions,
} from '../api/client'
import {
  clearStoredSession,
  loadStoredSession,
  saveStoredSession,
} from './storage'

type AuthContextValue = {
  status: 'loading' | 'signedIn' | 'signedOut'
  user: AuthUser | null
  /** Performs a request with the current access token, refreshing it once on 401. */
  api: AuthorizedRequest
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<AuthContextValue['status']>('loading')

  // `api` must stay referentially stable so effects that fetch don't re-run on
  // every token rotation, so reads go through a ref rather than state.
  const sessionRef = useRef<Session | null>(null)
  const applySession = useCallback((next: Session | null) => {
    sessionRef.current = next
    setSession(next)
  }, [])

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
        applySession(next)
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
  }, [applySession])

  const signIn = useCallback(
    async (email: string, password: string) => {
      const next = await authApi.login({ email, password })
      await saveStoredSession(next)
      applySession(next)
      setStatus('signedIn')
    },
    [applySession],
  )

  const signOut = useCallback(async () => {
    const token = sessionRef.current?.accessToken
    applySession(null)
    setStatus('signedOut')
    await clearStoredSession()
    if (token) {
      try {
        await authApi.logout(token)
      } catch {
        // Local sign-out already happened; a failed revoke shouldn't block it.
      }
    }
  }, [applySession])

  const api = useCallback<AuthorizedRequest>(
    async <T,>(path: string, options: Omit<RequestOptions, 'token'> = {}) => {
      const current = sessionRef.current
      if (!current) {
        throw new ApiError('You are signed out.', 401)
      }

      try {
        return await apiRequest<T>(path, {
          ...options,
          token: current.accessToken,
        })
      } catch (error) {
        const isExpired = error instanceof ApiError && error.status === 401
        if (!isExpired || !current.refreshToken) throw error

        let refreshed: Session
        try {
          refreshed = await authApi.refresh({
            refreshToken: current.refreshToken,
          })
        } catch {
          await signOut()
          throw new ApiError('Your session expired. Sign in again.', 401)
        }

        const next = { ...refreshed, refreshToken: current.refreshToken }
        await saveStoredSession(next)
        applySession(next)
        return apiRequest<T>(path, { ...options, token: next.accessToken })
      }
    },
    [applySession, signOut],
  )

  const value = useMemo<AuthContextValue>(
    () => ({ status, user: session?.user ?? null, api, signIn, signOut }),
    [status, session?.user, api, signIn, signOut],
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
