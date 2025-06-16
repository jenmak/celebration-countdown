import { Calendar } from "@/components/ui/calendar";
import { addMonths } from "date-fns";

interface SmallCalendarProps {
  monthOffset: number;
  onSelect?: (date: Date) => void;
  onAddCelebration?: () => void;
  onDateClick?: (date: Date) => void;
}

export function SmallCalendar({
  monthOffset,
  onSelect,
  onAddCelebration,
  onDateClick,
}: SmallCalendarProps) {
  return (
    <Calendar
      selectedDate={addMonths(new Date(), monthOffset)}
      onSelect={(date) => date && onSelect?.(date)}
      onAddCelebration={onAddCelebration}
      onDateClick={onDateClick}
      className="scale-50 origin-top-left"
      compact
      hideAddButton
    />
  );
} 