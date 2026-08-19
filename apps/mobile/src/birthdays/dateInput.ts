import { formatPlainDate, isValidPlainDate } from '@celebrationcountdown/shared'

/** Formats raw keystrokes as `MM/DD/YYYY` while the user types. */
export function maskDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  const month = digits.slice(0, 2)
  const day = digits.slice(2, 4)
  const year = digits.slice(4, 8)

  return [month, day, year].filter((part) => part.length > 0).join('/')
}

/** Converts a `MM/DD/YYYY` input into the `YYYY-MM-DD` the API expects. */
export function dateInputToISO(value: string): string | null {
  const digits = value.replace(/\D/g, '')
  if (digits.length !== 8) return null

  const date = {
    month: Number(digits.slice(0, 2)),
    day: Number(digits.slice(2, 4)),
    year: Number(digits.slice(4, 8)),
  }
  if (!isValidPlainDate(date)) return null

  return formatPlainDate(date)
}

export function validateBirthdateInput(value: string): string | undefined {
  if (!value.trim()) return 'Birthday is required'

  const iso = dateInputToISO(value)
  if (!iso) return 'Use MM/DD/YYYY'

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (new Date(`${iso}T00:00:00`) > today) {
    return 'Birthday cannot be in the future'
  }

  return undefined
}
