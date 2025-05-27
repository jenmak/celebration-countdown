'use client'

import React from 'react'
import { format, differenceInDays } from 'date-fns'

interface Birthday {
  id: string
  name: string
  date: Date
}

interface NotificationBannerProps {
  birthdays: Birthday[]
  daysToShow: number
  onDismiss: (birthdayId: string) => void
}

export default function NotificationBanner({
  birthdays,
  daysToShow,
  onDismiss,
}: NotificationBannerProps) {
  const today = new Date()
  const upcomingBirthdays = birthdays
    .map(birthday => {
      const birthdayDate = new Date(birthday.date)
      const nextBirthday = new Date(
        today.getFullYear(),
        birthdayDate.getMonth(),
        birthdayDate.getDate()
      )

      if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1)
      }

      return {
        ...birthday,
        daysUntil: differenceInDays(nextBirthday, today),
      }
    })
    .filter(birthday => birthday.daysUntil <= daysToShow)
    .sort((a, b) => a.daysUntil - b.daysUntil)

  if (upcomingBirthdays.length === 0) {
    return null
  }

  return (
    <div className="bg-primary-50 border-b border-primary-100">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-primary-100">
              <svg
                className="h-6 w-6 text-primary-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </span>
            <p className="ml-3 font-medium text-primary-900 truncate">
              <span className="md:hidden">
                {upcomingBirthdays.length} upcoming birthday
                {upcomingBirthdays.length === 1 ? '' : 's'}
              </span>
              <span className="hidden md:inline">
                {upcomingBirthdays.map((birthday, index) => (
                  <span key={birthday.id}>
                    {birthday.name}'s birthday in {birthday.daysUntil} day
                    {birthday.daysUntil === 1 ? '' : 's'}
                    {index < upcomingBirthdays.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </span>
            </p>
          </div>
          <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
            <div className="rounded-md shadow-sm">
              {upcomingBirthdays.map(birthday => (
                <button
                  key={birthday.id}
                  onClick={() => onDismiss(birthday.id)}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Dismiss
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 