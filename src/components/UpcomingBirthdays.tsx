'use client'

import React from 'react'
import { format, differenceInDays, isAfter, isBefore, startOfDay } from 'date-fns'

interface Birthday {
  id: string
  name: string
  date: Date
  notes?: string
}

interface UpcomingBirthdaysProps {
  birthdays: Birthday[]
  daysToShow: number
}

export default function UpcomingBirthdays({ birthdays, daysToShow }: UpcomingBirthdaysProps) {
  const today = startOfDay(new Date())
  const endDate = new Date(today)
  endDate.setDate(today.getDate() + daysToShow)

  const upcomingBirthdays = birthdays
    .map(birthday => {
      const birthdayDate = new Date(birthday.date)
      const nextBirthday = new Date(today.getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate())

      // If the birthday has already passed this year, set it to next year
      if (isBefore(nextBirthday, today)) {
        nextBirthday.setFullYear(today.getFullYear() + 1)
      }

      return {
        ...birthday,
        nextBirthday,
        daysUntil: differenceInDays(nextBirthday, today)
      }
    })
    .filter(birthday => isAfter(birthday.nextBirthday, today) && isBefore(birthday.nextBirthday, endDate))
    .sort((a, b) => a.daysUntil - b.daysUntil)

  if (upcomingBirthdays.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No upcoming birthdays in the next {daysToShow} days
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {upcomingBirthdays.map(birthday => (
        <div
          key={birthday.id}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {birthday.name}
              </h3>
              <p className="text-sm text-gray-500">
                {format(birthday.nextBirthday, 'MMMM d, yyyy')}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-1 text-sm font-medium text-primary-800 bg-primary-100 rounded-full">
                {birthday.daysUntil === 0
                  ? 'Today!'
                  : `${birthday.daysUntil} day${birthday.daysUntil === 1 ? '' : 's'} left`}
              </span>
            </div>
          </div>
          {birthday.notes && (
            <p className="mt-2 text-sm text-gray-600">
              {birthday.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  )
} 