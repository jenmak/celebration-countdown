import {
  birthdayCountdown,
  parsePlainDate,
  type BirthdayCountdown,
} from '@celebrationcountdown/shared'
import { RelationshipEnum } from '@celebrationcountdown/shared'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const RELATIONSHIP_LABELS: Record<RelationshipEnum, string> = {
  [RelationshipEnum.FAMILY]: 'Family',
  [RelationshipEnum.FRIEND]: 'Friend',
  [RelationshipEnum.COWORKER]: 'Coworker',
}

/** "August 19" — the birthday itself, without the birth year. */
export function formatBirthdayDay(birthdate: string): string {
  const { month, day } = parsePlainDate(birthdate)
  return `${MONTHS[month - 1]} ${day}`
}

/** "08/19/1994" — for prefilling the date input. */
export function formatBirthdateInput(birthdate: string): string {
  const { year, month, day } = parsePlainDate(birthdate)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(month)}/${pad(day)}/${year}`
}

export function formatCountdown({ daysUntil }: BirthdayCountdown): string {
  if (daysUntil === 0) return 'Today'
  if (daysUntil === 1) return 'Tomorrow'
  if (daysUntil < 7) return `In ${daysUntil} days`
  if (daysUntil < 14) return 'Next week'
  if (daysUntil < 60) return `In ${Math.round(daysUntil / 7)} weeks`
  return `In ${Math.round(daysUntil / 30)} months`
}

export function countdownFor(birthdate: string): BirthdayCountdown {
  return birthdayCountdown(birthdate)
}

export function initialsFor(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : ''
  return (first + last).toUpperCase()
}
