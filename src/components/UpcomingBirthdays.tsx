'use client'

import { format, addDays, differenceInDays } from 'date-fns'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Temporary mock data - will be replaced with real data from the database
const mockBirthdays = [
  {
    id: '1',
    name: 'John Doe',
    date: new Date(2024, 3, 15),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    id: '2',
    name: 'Jane Smith',
    date: new Date(2024, 3, 20),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  },
]

export function UpcomingBirthdays() {
  const today = new Date()
  const upcomingBirthdays = mockBirthdays
    .map((birthday) => {
      const nextBirthday = new Date(today.getFullYear(), birthday.date.getMonth(), birthday.date.getDate())
      if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1)
      }
      return {
        ...birthday,
        nextBirthday,
        daysUntil: differenceInDays(nextBirthday, today),
      }
    })
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Birthdays</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingBirthdays.map((birthday) => (
            <div
              key={birthday.id}
              className="flex items-center gap-4"
            >
              <img
                src={birthday.avatar}
                alt={birthday.name}
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium">{birthday.name}</p>
                <p className="text-sm text-muted-foreground">
                  {format(birthday.nextBirthday, 'MMMM d')} ·{' '}
                  {birthday.daysUntil === 0
                    ? 'Today!'
                    : `${birthday.daysUntil} days away`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 