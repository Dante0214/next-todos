import { Check, Pencil, Trash } from "lucide-react";
import { Todo } from "@/lib/supabase";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
      <button
        onClick={() => onToggle(todo.id, todo.completed)}
        className={`
          w-6 h-6 rounded border-2 flex items-center justify-center transition cursor-pointer
          ${
            todo.completed
              ? "bg-blue-600 border-blue-600"
              : "border-gray-300 hover:border-blue-400"
          }
        `}
      >
        {todo.completed && <Check size={16} className="text-white" />}
      </button>
      <span
        className={`
          flex-1 text-lg
          ${todo.completed ? "line-through text-gray-400" : "text-gray-700"}
        `}
      >
        {todo.title}
      </span>
      <button
        className="text-blue-500 hover:text-blue-600 transition cursor-pointer"
        onClick={() => onEdit(todo)}
      >
        <Pencil size={16} />
      </button>
      <button
        className="text-red-500 hover:text-red-600 transition cursor-pointer"
        onClick={() => onDelete(todo.id)}
      >
        <Trash size={16} />
      </button>
    </div>
  );
}
