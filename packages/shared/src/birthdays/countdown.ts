/** A calendar date with no time or timezone attached, e.g. `2026-08-19`. */
export type PlainDate = { year: number; month: number; day: number }

export type BirthdayCountdown = {
  /** The next occurrence of the birthday, as `YYYY-MM-DD`. */
  nextBirthday: string
  /** Whole days from today until the next occurrence; `0` means today. */
  daysUntil: number
  /** Age the person reaches on `nextBirthday`. */
  turningAge: number
  isToday: boolean
}

/** How many upcoming birthdays the home screen surfaces. */
export const UPCOMING_BIRTHDAY_LIMIT = 5

const MS_PER_DAY = 86_400_000

export function parsePlainDate(value: string): PlainDate {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim())
  if (!match) {
    throw new RangeError(`Expected a YYYY-MM-DD date, received "${value}"`)
  }
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  }
}

export function formatPlainDate({ year, month, day }: PlainDate): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${year}-${pad(month)}-${pad(day)}`
}

/** Reads the *local* calendar date off a Date, ignoring its time and offset. */
export function toPlainDate(date: Date): PlainDate {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

export function isValidPlainDate({ year, month, day }: PlainDate): boolean {
  if (!Number.isInteger(year) || year < 1 || year > 9999) return false
  if (!Number.isInteger(month) || month < 1 || month > 12) return false
  if (!Number.isInteger(day) || day < 1) return false
  return day <= daysInMonth(year, month)
}

function compareParts(a: PlainDate, b: PlainDate): number {
  return a.month - b.month || a.day - b.day
}

function toEpochDay({ year, month, day }: PlainDate): number {
  return Date.UTC(year, month - 1, day) / MS_PER_DAY
}

/**
 * Feb 29 birthdays fall back to the last day of February in non-leap years.
 */
function occurrenceInYear(birthdate: PlainDate, year: number): PlainDate {
  return {
    year,
    month: birthdate.month,
    day: Math.min(birthdate.day, daysInMonth(year, birthdate.month)),
  }
}

export function birthdayCountdown(
  birthdate: string,
  today: Date = new Date(),
): BirthdayCountdown {
  const birth = parsePlainDate(birthdate)
  const now = toPlainDate(today)

  const thisYear = occurrenceInYear(birth, now.year)
  const upcoming =
    compareParts(thisYear, now) >= 0
      ? thisYear
      : occurrenceInYear(birth, now.year + 1)

  const daysUntil = toEpochDay(upcoming) - toEpochDay(now)

  return {
    nextBirthday: formatPlainDate(upcoming),
    daysUntil,
    turningAge: upcoming.year - birth.year,
    isToday: daysUntil === 0,
  }
}

/**
 * Orders birthdays by how soon they come up, nearest first.
 * Ties (same calendar day) fall back to the provided label for stable ordering.
 */
export function compareByUpcomingBirthday<
  T extends { birthdate: string; fullName?: string },
>(a: T, b: T, today: Date = new Date()): number {
  const left = birthdayCountdown(a.birthdate, today)
  const right = birthdayCountdown(b.birthdate, today)
  return (
    left.daysUntil - right.daysUntil ||
    (a.fullName ?? '').localeCompare(b.fullName ?? '')
  )
}

export function sortByUpcomingBirthday<
  T extends { birthdate: string; fullName?: string },
>(items: readonly T[], today: Date = new Date()): T[] {
  return [...items].sort((a, b) => compareByUpcomingBirthday(a, b, today))
}
