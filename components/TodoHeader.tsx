import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar, LogOut } from "lucide-react";

interface TodoHeaderProps {
  selectedDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onLogout: () => void;
}

export function TodoHeader({
  selectedDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onLogout,
}: TodoHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center gap-3 sm:gap-0 mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-xl shadow">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onPrevMonth}
          className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
        </button>
        <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
          {format(selectedDate, "yyyy년 M월", { locale: ko })}
        </h1>
        <button
          onClick={onNextMonth}
          className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ChevronRight size={18} className="sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={onToday}
          className="ml-2 sm:ml-3 flex items-center gap-1 text-blue-600 text-xs sm:text-sm font-medium hover:bg-blue-50 px-2 py-1 rounded-lg"
        >
          <Calendar size={14} className="sm:w-4 sm:h-4" /> 오늘
        </button>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer text-sm sm:text-base"
      >
        <LogOut size={16} className="sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">로그아웃</span>
      </button>
    </div>
  );
}
