import { apiRequest } from './client'

export type AuthUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
}

export type Session = {
  accessToken: string
  refreshToken?: string
  idToken?: string
  expiresIn?: number
  tokenType: string
  user: AuthUser
}

export type SignupResult = {
  userConfirmed: boolean
  codeDelivery: string | null
  message: string
}

export const authApi = {
  signup: (body: {
    email: string
    firstName: string
    lastName: string
    password: string
  }) => apiRequest<SignupResult>('/auth/signup', { method: 'POST', body }),

  confirmSignUp: (body: { email: string; code: string }) =>
    apiRequest<{ success: boolean }>('/auth/confirm-signup', {
      method: 'POST',
      body,
    }),

  resendConfirmation: (body: { email: string }) =>
    apiRequest<{ message: string }>('/auth/resend-confirmation', {
      method: 'POST',
      body,
    }),

  login: (body: { email: string; password: string }) =>
    apiRequest<Session>('/auth/login', { method: 'POST', body }),

  refresh: (body: { refreshToken: string }) =>
    apiRequest<Session>('/auth/refresh', { method: 'POST', body }),

  logout: (token: string) =>
    apiRequest<{ success: boolean }>('/auth/logout', {
      method: 'POST',
      token,
    }),

  forgotPassword: (body: { email: string }) =>
    apiRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body,
    }),

  confirmForgotPassword: (body: {
    email: string
    code: string
    newPassword: string
  }) =>
    apiRequest<{ success: boolean }>('/auth/confirm-forgot-password', {
      method: 'POST',
      body,
    }),

  me: (token: string) => apiRequest<AuthUser>('/auth/me', { token }),
}
