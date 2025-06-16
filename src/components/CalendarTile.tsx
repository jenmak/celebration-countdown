import { ReactNode } from "react";

interface CalendarTileProps {
  children: ReactNode;
  className?: string;
}

export function CalendarTile({ children, className = "" }: CalendarTileProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
} 