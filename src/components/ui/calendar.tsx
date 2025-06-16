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
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

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
  title,
}: CalendarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-4 mb-4 relative">
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 absolute left-0"
          onClick={() => onSelect?.(subMonths(selectedDate || new Date(), 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold text-[#103242]">{title}</h2>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 absolute right-0"
          onClick={() => onSelect?.(addMonths(selectedDate || new Date(), 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
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
          caption: 'flex justify-center pt-1 relative items-center',
          caption_label: 'text-sm font-medium text-[#103242]',
          nav: 'space-x-1 flex items-center',
          nav_button: cn(
            buttonVariants({ variant: 'outline' }),
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-[#103242]'
          ),
          nav_button_previous: 'absolute left-1',
          nav_button_next: 'absolute right-1',
          table: 'w-full border-collapse space-y-[5px] space-x-[5px]',
          head_row: 'flex w-full justify-between gap-[5px]',
          head_cell:
            'text-[#103242] rounded-md w-[109px] font-normal text-[0.8rem] flex-1 text-left pl-[10px] font-nunito',
          row: 'flex w-full mt-[9px] justify-between gap-[5px]',
          cell: 'h-[109px] w-[109px] text-center text-sm p-0 relative flex-1 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
          day: cn(
            'h-[109px] w-[109px] p-0 font-normal aria-selected:opacity-100 text-[#103242] shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-all duration-200 hover:-translate-y-0.5 w-full font-nunito text-lg',
            buttonVariants({ variant: 'ghost', className: 'h-[109px]' })
          ),
          day_range_end: 'day-range-end',
          day_selected:
            'bg-[#103242] text-white hover:bg-[#103242] hover:text-white focus:bg-[#103242] focus:text-white shadow-[0_4px_8px_rgba(0,0,0,0.2)]',
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
                !compact && "h-[109px] w-[109px] bg-white rounded-md"
              )}>
                {compact ? (
                  <div className="group relative">
                    <span className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-full",
                      isSelected && "bg-[#103242]",
                      isToday && !isSelected && "border-2 border-[#103242]",
                      "bg-[#103242] opacity-20",
                      "transition-all duration-200",
                      "group-hover:opacity-100 group-hover:scale-110",
                      inter.className
                    )}>
                      <span className="opacity-0 group-hover:opacity-100 text-white text-[24px] transition-opacity duration-200">
                        {date.getDate()}
                      </span>
                    </span>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "relative h-9 w-9 p-0 text-center text-sm font-normal",
                      isToday && "font-bold",
                      isSelected && "font-bold",
                      isOutsideMonth && "text-gray-400",
                      inter.className
                    )}
                  >
                    <span className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-full",
                      isSelected && "bg-[#103242] text-white",
                      isToday && !isSelected && "border-2 border-[#103242]",
                      "text-[#103242] text-[36px]",
                      inter.className
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