'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'
import { cn } from '@/lib/utils'

export function BirthdayCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Temporary mock data - will be replaced with real data from the database
  const mockBirthdays = [
    { date: new Date(2024, 3, 15), name: 'John Doe' },
    { date: new Date(2024, 3, 20), name: 'Jane Smith' },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        {format(currentDate, 'MMMM yyyy')}
      </h2>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
        {days.map((day) => {
          const birthdays = mockBirthdays.filter((b) =>
            isSameMonth(b.date, day) && b.date.getDate() === day.getDate()
          )

          return (
            <div
              key={day.toString()}
              className={cn(
                'min-h-[100px] p-2 border rounded-lg',
                !isSameMonth(day, currentDate) && 'bg-muted/50',
                isToday(day) && 'border-primary'
              )}
            >
              <div className="text-sm font-medium">{format(day, 'd')}</div>
              {birthdays.map((birthday) => (
                <div
                  key={birthday.name}
                  className="mt-1 text-xs p-1 bg-primary/10 rounded"
                >
                  {birthday.name}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
} 