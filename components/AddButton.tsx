import { Plus } from "lucide-react";

interface AddButtonProps {
  onClick: () => void;
}

export function AddButton({ onClick }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 left-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition hover:scale-110"
    >
      <Plus size={24} />
    </button>
  );
}
