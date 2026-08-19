const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const MIN_PASSWORD_LENGTH = 8

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'Email is required'
  if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address'
  return undefined
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'Password is required'
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  }
  return undefined
}

export function validateRequired(
  value: string,
  fieldName: string,
): string | undefined {
  return value.trim() ? undefined : `${fieldName} is required`
}

export function validateCode(value: string): string | undefined {
  if (!value.trim()) return 'Confirmation code is required'
  if (!/^\d{4,10}$/.test(value.trim())) return 'Enter the code from your email'
  return undefined
}
