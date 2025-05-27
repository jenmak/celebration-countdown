'use client'

import React, { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
} from 'date-fns'

interface Birthday {
  id: string
  name: string
  date: Date
}

interface CalendarProps {
  birthdays: Birthday[]
  onDateClick: (date: Date) => void
}

export default function Calendar({ birthdays, onDateClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getBirthdaysForDate = (date: Date) => {
    return birthdays.filter(birthday =>
      isSameDay(new Date(birthday.date), date)
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Previous month"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}

        {days.map(day => {
          const dayBirthdays = getBirthdaysForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isCurrentDay = isToday(day)

          return (
            <button
              key={day.toString()}
              onClick={() => onDateClick(day)}
              className={`
                p-2 h-24 text-left relative
                ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                ${isCurrentDay ? 'ring-2 ring-primary-500' : ''}
                hover:bg-gray-50 transition-colors
              `}
            >
              <span className={`
                text-sm
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${isCurrentDay ? 'font-bold' : ''}
              `}>
                {format(day, 'd')}
              </span>

              {dayBirthdays.length > 0 && (
                <div className="mt-1">
                  {dayBirthdays.map(birthday => (
                    <div
                      key={birthday.id}
                      className="text-xs bg-primary-100 text-primary-800 rounded px-1 py-0.5 mb-1 truncate"
                    >
                      {birthday.name}
                    </div>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
} 