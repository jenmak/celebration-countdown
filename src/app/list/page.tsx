'use client'

import { useState, ChangeEvent } from 'react'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Temporary mock data - will be replaced with real data from the database
const mockBirthdays = [
  {
    id: '1',
    name: 'John Doe',
    date: new Date(2024, 3, 15),
    notes: 'Loves chocolate cake',
  },
  {
    id: '2',
    name: 'Jane Smith',
    date: new Date(2024, 3, 20),
    notes: 'Prefers vanilla ice cream',
  },
]

export default function ListView() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i.toString(),
    label: format(new Date(2024, i, 1), 'MMMM'),
  }))

  const filteredBirthdays = mockBirthdays.filter(
    (birthday) => birthday.date.getMonth() === selectedMonth
  )

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Birthday List</h1>
          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(Number(value))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredBirthdays.map((birthday) => (
            <Card key={birthday.id}>
              <CardHeader>
                <CardTitle>{birthday.name}</CardTitle>
                <CardDescription>
                  {format(birthday.date, 'MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              {birthday.notes && (
                <CardContent>
                  <p className="text-muted-foreground">{birthday.notes}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 