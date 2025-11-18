import { format, isSameDay, isToday } from "date-fns";
import { Todo } from "@/lib/supabase";
interface CalendarProps {
  days: (Date | null)[];
  selectedDate: Date;
  monthlyTodos: Record<string, Todo[]>;
  onSelectDate: (date: Date) => void;
  truncateTitle: (title: string) => string;
}

export function Calendar({
  days,
  selectedDate,
  monthlyTodos,
  onSelectDate,
  truncateTitle,
}: CalendarProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-3 mb-4 sm:p-6 sm:mb-6">
      <div className="grid grid-cols-7 sm:gap-2 sm:mb-4 gap-1 mb-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 py-1 sm:py-2 text-xs sm:text-base"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day, i) =>
          day ? (
            <button
              key={day.toString()}
              onClick={() => onSelectDate(day)}
              className={`
                            aspect-square p-2 rounded-lg font-medium transition text-left flex flex-col items-start gap-1 overflow-hidden
                            ${
                              isSameDay(day, selectedDate)
                                ? "bg-blue-600 text-white shadow-lg scale-105"
                                : isToday(day)
                                ? "bg-blue-100 text-blue-700 border-2 border-blue-400"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }
                          `}
            >
              <span className="text-xs sm:text-base">{format(day, "d")}</span>
              <div className="flex flex-col gap-0.5 sm:gap-1 w-full">
                {(monthlyTodos[format(day, "yyyy-MM-dd")] || [])
                  .slice(0, 2)
                  .map((todo) => (
                    <span
                      key={todo.id}
                      className="text-[0.6rem] sm:text-xs font-normal truncate leading-tight"
                    >
                      {truncateTitle(todo.title)}
                    </span>
                  ))}
              </div>
            </button>
          ) : (
            <div key={`blank-${i}`} />
          )
        )}
      </div>
    </div>
  );
}
