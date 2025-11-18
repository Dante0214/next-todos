"use client";

import { supabase, Todo } from "@/lib/supabase";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  subMonths,
  addMonths,
} from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TodoHeader } from "@/components/TodoHeader";
import { Calendar } from "@/components/Calendar";
import { TodoList } from "@/components/TodoList";
import { AddButton } from "@/components/AddButton";
import { TodoModal } from "@/components/TodoModal";

export default function TodoApp() {
  const [user, setUser] = useState<any>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthlyTodos, setMonthlyTodos] = useState<Record<string, Todo[]>>({});
  const [showModal, setShowModal] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTodoTitle, setEditTodoTitle] = useState("");
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
  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setEditTodoTitle(todo.title);
    setShowEditModal(true);
  };
  const updateTodo = async () => {
    if (!editTodoTitle.trim() || !editingTodo) return;

    const { error } = await supabase
      .from("todos")
      .update({ title: editTodoTitle })
      .eq("id", editingTodo.id);

    if (!error) {
      setEditTodoTitle("");
      setEditingTodo(null);
      setShowEditModal(false);
      fetchTodos();
      fetchMonthlyTodos();
    } else {
      alert("수정에 실패했습니다.");
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
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingTodo(null);
    setEditTodoTitle("");
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4">
      <div className="max-w-4xl mx-auto pb-20 sm:pb-4">
        <TodoHeader
          selectedDate={selectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          onLogout={handleLogout}
        />
        <Calendar
          days={days}
          selectedDate={selectedDate}
          monthlyTodos={monthlyTodos}
          onSelectDate={setSelectedDate}
          truncateTitle={truncateTitle}
        />
        <TodoList
          selectedDate={selectedDate}
          todos={todos}
          onToggle={toggleTodo}
          onEdit={handleEditTodo}
          onDelete={handleDeleteTodo}
        />

        <AddButton onClick={() => setShowModal(true)} />
        <TodoModal
          isOpen={showModal}
          title="할 일 추가"
          value={newTodoTitle}
          selectedDate={selectedDate}
          onChange={setNewTodoTitle}
          onSubmit={addTodo}
          onClose={() => setShowModal(false)}
          submitText="추가"
        />
        <TodoModal
          isOpen={showEditModal}
          title="할 일 수정"
          value={editTodoTitle}
          onChange={setEditTodoTitle}
          onSubmit={updateTodo}
          onClose={handleCloseEditModal}
          submitText="수정"
        />
      </div>
    </div>
  );
}
