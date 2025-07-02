import { MdDragIndicator } from "react-icons/md";

export default function QuestionCard({
  question,
  idx,
  onChange,
  onOptionChange,
  onAddOption,
  onDeleteOption,
  onDelete,
  dragHandleProps,
  flash
}) {
  return (
    <div
      className={`bg-violet-50 rounded-xl p-4 mb-6 shadow flex flex-col transition-all duration-500
        ${flash ? "animate-flash-drop" : ""}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-violet-700 flex items-center gap-2">
          <span
            {...dragHandleProps}
            className="cursor-grab text-gray-400 hover:text-violet-600 active:scale-125 transition text-3xl md:text-2xl"
            title="Drag to reorder"
            style={{ touchAction: "none" }}
          >
            <MdDragIndicator />
          </span>
          {idx + 1}. {question.type}
        </span>
        <button
          type="button"
          className="text-red-500 hover:underline"
          onClick={() => onDelete(idx)}
        >
          Delete
        </button>
      </div>
      <input
        type="text"
        placeholder="Question title"
        className="w-full mb-2 px-3 py-2 rounded border border-gray-200 bg-white"
        value={question.title}
        onChange={e => onChange(idx, "title", e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Question text"
        className="w-full mb-2 px-3 py-2 rounded border border-gray-200 bg-white"
        value={question.questionText}
        onChange={e => onChange(idx, "questionText", e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description (optional)"
        className="w-full mb-2 px-3 py-2 rounded border border-gray-200 bg-white"
        value={question.description}
        onChange={e => onChange(idx, "description", e.target.value)}
      />
      {(question.type === "multiple" || question.type === "checkbox" || question.type === "dropdown") && (
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">Options:</label>
          {question.options.map((opt, oi) => (
            <div key={oi} className="flex items-center mb-1">
              <input
                type="text"
                className="flex-1 px-2 py-1 rounded border border-gray-200 bg-white"
                value={opt}
                onChange={e => onOptionChange(idx, oi, e.target.value)}
                required
              />
              <button
                type="button"
                className="ml-2 text-red-400 hover:text-red-600"
                onClick={() => onDeleteOption(idx, oi)}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mt-1 text-violet-600 hover:underline"
            onClick={() => onAddOption(idx)}
          >
            + Add option
          </button>
        </div>
      )}
      <div className="flex gap-4 mt-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={question.showInTable}
            onChange={e => onChange(idx, "showInTable", e.target.checked)}
          />
          Show in table
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={question.required}
            onChange={e => onChange(idx, "required", e.target.checked)}
          />
          Required
        </label>
      </div>
    </div>
  );
}
