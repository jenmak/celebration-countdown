import { useAuth0 } from '@auth0/auth0-react'

export function useApi() {
  const { getAccessTokenSilently } = useAuth0()

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = await getAccessTokenSilently()

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`)
    }

    return response.json()
  }

  return { fetchWithAuth }
} 