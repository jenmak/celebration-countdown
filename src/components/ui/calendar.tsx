'use client';

import { useEffect, useState } from 'react';
import { DateRange, DayContent as ReactDayPickerDayContent } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { isSameDay, isSameMonth, addMonths, subMonths, getDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import 'react-day-picker/dist/style.css';
import * as React from "react";
import { DayPicker } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

interface Celebration {
  id: string;
  title: string;
  description: string;
  type: 'BIRTHDAY' | 'ANNIVERSARY' | 'HOLIDAY' | 'OTHER';
  date: string;
  time?: string;
  location?: string;
}

export interface CalendarProps {
  className?: string;
  selectedDate?: Date;
  onSelect?: (date: Date | undefined) => void;
  onDateClick?: (date: Date) => void;
  hasBirthday?: (date: Date) => boolean;
  hasCelebration?: (date: Date) => boolean;
  compact?: boolean;
  hideAddButton?: boolean;
  title?: string;
}

export function Calendar({
  className,
  selectedDate,
  onSelect,
  onDateClick,
  hasBirthday,
  hasCelebration,
  compact = false,
  hideAddButton = false,
}: CalendarProps) {
  return (
    <div className="w-full">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          if (date && onDateClick) {
            onDateClick(date);
          }
          if (onSelect) {
            onSelect(date);
          }
        }}
        className={cn('p-3 w-full', className)}
        classNames={{
          months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full',
          month: 'space-y-4 w-full',
          caption: 'flex justify-center pt-1 relative items-center w-full mb-4',
          caption_label: 'text-lg font-medium text-[#103242] w-full text-center',
          nav: 'space-x-1 flex items-center absolute w-full',
          nav_button: cn(
            buttonVariants({ variant: 'outline' }),
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-[#103242]'
          ),
          nav_button_previous: 'absolute left-1',
          nav_button_next: 'absolute right-1',
          table: 'w-full border-collapse space-y-[5px] space-x-[5px]',
          head_row: 'flex w-full justify-between gap-[5px]',
          head_cell:
            'text-[#103242] rounded-md w-[20%] font-semibold text-[0.8rem] flex-1 text-left pl-[10px] font-poppins',
          row: 'flex w-full mt-[9px] justify-between gap-[5px]',
          cell: 'h-[80px] w-[20%] text-center text-sm p-0 relative flex-1 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
          day: cn(
            !compact && 'shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)]',
            'h-[80px] w-full p-0 font-normal aria-selected:opacity-100 text-[#103242] transition-all duration-200 hover:-translate-y-0.5 font-poppins text-lg',
            buttonVariants({ variant: 'ghost', className: 'h-[80px]' })
          ),
          day_range_end: 'day-range-end',
          day_selected: cn(
            !compact && 'shadow-[0_4px_8px_rgba(0,0,0,0.2)]',
            'bg-[#103242] text-white hover:bg-[#103242] hover:text-white focus:bg-[#103242] focus:text-white'
          ),
          day_today: 'bg-white text-[#103242] border-2 border-[#103242]',
          day_outside:
            'day-outside text-[#103242]/50 aria-selected:bg-accent/50 aria-selected:text-[#103242] aria-selected:opacity-30',
          day_disabled: 'text-[#103242]/50',
          day_range_middle:
            'aria-selected:bg-accent aria-selected:text-[#103242]',
          day_hidden: 'invisible',
        }}
        components={{
          DayContent: ({ date, displayMonth }) => {
            const isBirthday = hasBirthday?.(date);
            const hasEvent = hasCelebration?.(date);
            const isToday = isSameDay(date, new Date());
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
            const isOutsideMonth = date.getMonth() !== displayMonth.getMonth();

            return (
              <div className={cn(
                "relative flex items-center justify-center",
                !compact && "h-[80px] w-full bg-white rounded-md"
              )}>
                {compact ? (
                  <div className="group relative">
                    <span className={cn(
                      "flex items-center justify-center w-7 h-7 rounded-full",
                      isSelected && "bg-[#103242]",
                      isToday && !isSelected && "border-2 border-[#103242]",
                      "text-[#103242] text-[20px]",
                      poppins.className
                    )}>
                      {date.getDate()}
                    </span>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "relative h-9 w-9 p-0 text-center text-sm font-normal",
                      isToday && "font-bold",
                      isSelected && "font-bold",
                      isOutsideMonth && "text-gray-400",
                      poppins.className
                    )}
                  >
                    <span className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-full",
                      isSelected && "bg-[#103242] text-white",
                      !isToday && 'text-[36px]',
                      isToday && !isSelected && "border-2 border-[#103242]",
                      "text-[#103242]",
                      poppins.className
                    )}>
                      {date.getDate()}
                    </span>
                  </div>
                )}
                {hasEvent && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-[#103242]" />
                )}
                {isBirthday && (
                  <span className="absolute -top-1 -right-1 text-xs">🎈</span>
                )}
              </div>
            );
          },
        }}
      />
    </div>
  );
} 