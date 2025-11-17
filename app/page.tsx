"use client";

import { supabase, Todo } from "@/lib/supabase";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  getDay,
  subMonths,
  addMonths,
} from "date-fns";
import { ko } from "date-fns/locale";
import { useRouter } from "next/navigation";
import {
  Plus,
  LogOut,
  Check,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function TodoApp() {
  const [user, setUser] = useState<any>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthlyTodos, setMonthlyTodos] = useState<Record<string, Todo[]>>({});
  const [showModal, setShowModal] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const monthKey = format(selectedDate, "yyyy-MM");

  const truncateTitle = (title: string) => {
    const maxLen = 8;
    return title.length > maxLen ? `${title.slice(0, maxLen)}...` : title;
  };

  const fetchTodos = async () => {
    if (!user) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", dateStr)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setTodos(data);
    }
  };
  const fetchMonthlyTodos = async (referenceDate = selectedDate) => {
    if (!user) return;
    const start = startOfMonth(referenceDate);
    const end = endOfMonth(referenceDate);
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", format(start, "yyyy-MM-dd"))
      .lte("date", format(end, "yyyy-MM-dd"))
      .order("date", { ascending: true });
    if (!error && data) {
      const grouped = data.reduce<Record<string, Todo[]>>((acc, todo) => {
        acc[todo.date] = acc[todo.date] ? [...acc[todo.date], todo] : [todo];
        return acc;
      }, {});
      setMonthlyTodos(grouped);
    }
  };
  const addTodo = async () => {
    if (!newTodoTitle.trim()) return;
    const { error } = await supabase.from("todos").insert({
      title: newTodoTitle,
      date: format(selectedDate, "yyyy-MM-dd"),
      user_id: user.id,
    });
    if (!error) {
      setNewTodoTitle("");
      setShowModal(false);
      fetchTodos();
      fetchMonthlyTodos();
    }
  };
  const toggleTodo = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !completed })
      .eq("id", id);
    if (!error) {
      fetchTodos();
      fetchMonthlyTodos();
    }
  };
  const handleDeleteTodo = async (id: string) => {
    if (!window.confirm("일정을 삭제하시겠습니까?")) {
      return;
    }

    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("삭제 중 오류가 발생했습니다:", error);
      alert("삭제에 실패했습니다.");
      return;
    }

    fetchTodos();
    fetchMonthlyTodos();
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };
  const getDaysInMonth = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start, end });

    const firstDayOfWeek = getDay(start);
    const blanks = Array(firstDayOfWeek).fill(null); // 앞쪽 빈칸
    return [...blanks, ...days];
  };
  const handlePrevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
  const handleNextMonth = () => setSelectedDate(addMonths(selectedDate, 1));
  const handleToday = () => setSelectedDate(new Date());

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    checkUser();
  }, []);
  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user, selectedDate]);

  useEffect(() => {
    if (user) {
      fetchMonthlyTodos();
    }
  }, [user, monthKey]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  const days = getDaysInMonth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {format(selectedDate, "yyyy년 M월", { locale: ko })}
            </h1>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={handleToday}
              className="ml-3 flex items-center gap-1 text-blue-600 text-sm font-medium hover:bg-blue-50 px-2 py-1 rounded-lg"
            >
              <Calendar size={16} /> 오늘
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
          >
            <LogOut size={20} />
            로그아웃
          </button>
        </div>

        {/* 달력 */}
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
                  onClick={() => setSelectedDate(day)}
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

        {/* 투두 리스트 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            {format(selectedDate, "M월 d일", { locale: ko })}의 할 일
          </h2>

          {todos.length === 0 ? (
            <p className="text-gray-400 text-center py-8">할 일이 없습니다</p>
          ) : (
            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <button
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    className={`
                      w-6 h-6 rounded border-2 flex items-center justify-center transition cursor-pointer
                      ${
                        todo.completed
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 hover:border-blue-400"
                      }
                    `}
                  >
                    {todo.completed && (
                      <Check size={16} className="text-white" />
                    )}
                  </button>
                  <span
                    className={`
                      flex-1 text-lg
                      ${
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-700"
                      }
                    `}
                  >
                    {todo.title}
                  </span>

                  <button
                    className="text-red-500 hover:text-red-600 transition cursor-pointer"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 추가 버튼 */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 left-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition hover:scale-110"
        >
          <Plus size={24} />
        </button>

        {/* 투두 추가 모달 */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                {format(selectedDate, "M월 d일", { locale: ko })}
                <br /> 할 일 추가
              </h3>
              <input
                type="text"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="할 일을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  취소
                </button>
                <button
                  onClick={addTodo}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
