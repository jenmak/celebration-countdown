import { ReactNode } from "react";

interface CalendarContainerProps {
  children: ReactNode;
}

export function CalendarContainer({ children }: CalendarContainerProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {children}
    </div>
  );
} 