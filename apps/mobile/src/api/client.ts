const DEFAULT_HOST = 'http://127.0.0.1:3001'
const API_VERSION = 'v1'

/** EXPO_PUBLIC_API_URL may be set with or without the version prefix. */
function resolveBaseUrl(): string {
  const host = (process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_HOST).replace(/\/+$/, '')
  return host.endsWith(`/${API_VERSION}`) ? host : `${host}/${API_VERSION}`
}

export const API_BASE_URL = resolveBaseUrl()

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type Envelope<T> = { data: T; statusCode: number; message?: string }

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  token?: string | null
}

function readErrorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as { message: unknown }).message
    if (Array.isArray(message)) return message.join('\n')
    if (typeof message === 'string' && message.length > 0) return message
  }
  if (status === 401) return 'Your email or password is incorrect.'
  return 'Something went wrong. Please try again.'
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {},
): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(
      `Can't reach the server at ${API_BASE_URL}. Check that the API is running.`,
      0,
    )
  }

  const text = await response.text()
  const payload: unknown = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new ApiError(readErrorMessage(payload, response.status), response.status)
  }

  return (payload as Envelope<T>)?.data as T
}
