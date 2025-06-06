'use client'

import { BirthdayCalendar } from '@/components/BirthdayCalendar'
import { UpcomingBirthdays } from '@/components/UpcomingBirthdays'

export default function Home() {
  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        <BirthdayCalendar />
        <UpcomingBirthdays />
      </div>
    </div>
  )
}
