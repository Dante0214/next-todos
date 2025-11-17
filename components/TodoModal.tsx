import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface TodoModalProps {
  isOpen: boolean;
  title: string;
  value: string;
  selectedDate?: Date;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitText: string;
}

export function TodoModal({
  isOpen,
  title,
  value,
  selectedDate,
  onChange,
  onSubmit,
  onClose,
  submitText,
}: TodoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          {selectedDate
            ? `${format(selectedDate, "M월 d일", { locale: ko })}\n${title}`
            : title}
        </h3>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="할 일을 입력하세요"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyPress={(e) => e.key === "Enter" && onSubmit()}
          autoFocus
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
}
