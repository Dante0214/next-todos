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
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
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
              <span className="text-base">{format(day, "d")}</span>
              <div className="flex flex-col gap-1 w-full">
                {(monthlyTodos[format(day, "yyyy-MM-dd")] || [])
                  .slice(0, 2)
                  .map((todo) => (
                    <span
                      key={todo.id}
                      className="text-xs font-normal truncate"
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
