import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, isToday, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from "date-fns"

import { cn } from "../../lib/utils"
import { buttonVariants } from "./button"

interface CalendarEvent {
  id: string | number
  title: string
  date: string // ISO date string
  color?: string
}

interface CalendarProps {
  events?: CalendarEvent[]
  onDateClick?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  className?: string
}

function Calendar({
  events = [],
  onDateClick,
  onEventClick,
  className = '',
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date())

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const today = () => {
    setCurrentMonth(new Date())
  }

  // Generate days for the current month
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Determine the first day of the month to calculate proper offset
  const startDay = getDay(monthStart)

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event =>
      isSameDay(parseISO(event.date), date)
    )
  }

  // Get default colors for events if not specified
  const getDefaultColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500']
    return colors[index % colors.length]
  }

  return (
    <div className={cn("bg-white rounded-lg shadow", className)}>
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={today}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-sm")}
          >
            Today
          </button>
          <button
            onClick={prevMonth}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "p-2")}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextMonth}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "p-2")}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="grid grid-cols-7 gap-px">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2 text-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}

          {/* Empty cells for days of the week before the first day of the month */}
          {Array.from({ length: startDay }).map((_, index) => (
            <div key={`empty-${index}`} className="bg-gray-50 h-24 sm:h-32 p-2"></div>
          ))}

          {/* Cells for each day of the month */}
          {daysInMonth.map(day => {
            const dateEvents = getEventsForDate(day)
            const isCurrentMonth = true // Always show current month days
            const isSelectedToday = isToday(day)

            return (
              <div
                key={day.toString()}
                className={cn(
                  "relative bg-white h-24 sm:h-32 p-2 border-t border-l hover:bg-gray-50 cursor-pointer",
                  isSelectedToday && "bg-blue-50"
                )}
                onClick={() => onDateClick && onDateClick(day)}
              >
                <div className={cn(
                  "text-right",
                  isSelectedToday ? "text-blue-600 font-semibold" : "text-gray-700"
                )}>
                  {format(day, 'd')}
                </div>
                <div className="mt-1 max-h-16 overflow-y-auto">
                  {dateEvents.length > 0 && dateEvents.map((event, eventIndex) => (
                    <div
                      key={event.id}
                      className={cn(
                        "mb-1 px-2 py-1 text-xs text-white rounded truncate cursor-pointer",
                        event.color || getDefaultColor(eventIndex)
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick && onEventClick(event)
                      }}
                    >
                      {event.title}
                    </div>
                  ))}

                  {dateEvents.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dateEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar } 