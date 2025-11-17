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
    <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow">
      <div className="flex items-center gap-3">
        <button
          onClick={onPrevMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {format(selectedDate, "yyyy년 M월", { locale: ko })}
        </h1>
        <button
          onClick={onNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ChevronRight size={20} />
        </button>
        <button
          onClick={onToday}
          className="ml-3 flex items-center gap-1 text-blue-600 text-sm font-medium hover:bg-blue-50 px-2 py-1 rounded-lg"
        >
          <Calendar size={16} /> 오늘
        </button>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
      >
        <LogOut size={20} />
        로그아웃
      </button>
    </div>
  );
}
