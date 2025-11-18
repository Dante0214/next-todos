import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Todo } from "@/lib/supabase";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  selectedDate: Date;
  todos: Todo[];
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function TodoList({
  selectedDate,
  todos,
  onToggle,
  onEdit,
  onDelete,
}: TodoListProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">
        {format(selectedDate, "M월 d일", { locale: ko })}의 할 일
      </h2>

      {todos.length === 0 ? (
        <p className="text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">
          할 일이 없습니다
        </p>
      ) : (
        <div className="space-y-1.5 sm:space-y-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
