import { MdDragIndicator, MdDelete, MdAdd, MdRemove } from "react-icons/md";
import { FaQuestion, FaRegCheckSquare, FaListUl } from "react-icons/fa";
import { BsTextareaResize, BsInputCursor } from "react-icons/bs";
import { AiOutlineNumber } from "react-icons/ai";

const questionTypeIcons = {
  text: BsInputCursor,
  textarea: BsTextareaResize,
  integer: AiOutlineNumber,
  checkbox: FaRegCheckSquare,
  radio: FaListUl,
  select: FaListUl,
};

const questionTypeColors = {
  text: "bg-blue-100 text-blue-700 border-blue-200",
  textarea: "bg-green-100 text-green-700 border-green-200",
  integer: "bg-orange-100 text-orange-700 border-orange-200",
  checkbox: "bg-purple-100 text-purple-700 border-purple-200",
  radio: "bg-pink-100 text-pink-700 border-pink-200",
  select: "bg-indigo-100 text-indigo-700 border-indigo-200",
};

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
  const Icon = questionTypeIcons[question.type] || FaQuestion;
  const colorClass = questionTypeColors[question.type] || "bg-gray-100 text-gray-700 border-gray-200";
  
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:shadow-xl group
        ${flash ? "animate-pulse bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20" : ""}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span
            {...dragHandleProps}
            className="cursor-grab text-gray-400 hover:text-violet-600 active:scale-125 transition-all duration-200 text-2xl p-1 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"
            title="Drag to reorder"
            style={{ touchAction: "none" }}
          >
            <MdDragIndicator />
          </span>
          
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${colorClass} dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600`}>
            <Icon className="text-sm" />
            <span className="font-semibold text-sm capitalize">
              {idx + 1}. {question.type}
            </span>
          </div>
        </div>
        
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group/delete"
          onClick={() => onDelete(idx)}
        >
          <MdDelete className="text-lg group-hover/delete:scale-110 transition-transform" />
          <span className="text-sm font-medium">Delete</span>
        </button>
      </div>

      {/* Question Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Question Title *
            </label>
            <input
              type="text"
              placeholder="Enter a clear, concise title"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-200"
              value={question.title}
              onChange={e => onChange(idx, "title", e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Question Text *
            </label>
            <input
              type="text"
              placeholder="What do you want to ask?"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-200"
              value={question.questionText}
              onChange={e => onChange(idx, "questionText", e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Description (Optional)
          </label>
          <textarea
            placeholder="Provide additional context or instructions..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-200 resize-none"
            value={question.description}
            onChange={e => onChange(idx, "description", e.target.value)}
          />
        </div>

        {/* Options for multiple choice questions */}
        {(question.type === "radio" || question.type === "checkbox" || question.type === "select") && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Answer Options
              </label>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                onClick={() => onAddOption(idx)}
              >
                <MdAdd className="text-lg" />
                Add Option
              </button>
            </div>
            
            <div className="space-y-3">
              {question.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-3 group/option">
                  <div className="flex-shrink-0 w-8 h-8 bg-white dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {oi + 1}
                  </div>
                  <input
                    type="text"
                    placeholder={`Option ${oi + 1}`}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-200"
                    value={opt}
                    onChange={e => onOptionChange(idx, oi, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="flex-shrink-0 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 opacity-0 group-hover/option:opacity-100"
                    onClick={() => onDeleteOption(idx, oi)}
                    disabled={question.options.length <= 2}
                  >
                    <MdRemove className="text-lg" />
                  </button>
                </div>
              ))}
            </div>
            
            {question.options.length < 2 && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                At least 2 options are required
              </p>
            )}
          </div>
        )}

        {/* Question Settings */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={question.showInTable}
                onChange={e => onChange(idx, "showInTable", e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                question.showInTable 
                  ? "bg-violet-600 border-violet-600" 
                  : "border-gray-300 dark:border-gray-600 group-hover:border-violet-400"
              }`}>
                {question.showInTable && (
                  <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              Show in results table
            </span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={question.required}
                onChange={e => onChange(idx, "required", e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                question.required 
                  ? "bg-red-500 border-red-500" 
                  : "border-gray-300 dark:border-gray-600 group-hover:border-red-400"
              }`}>
                {question.required && (
                  <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
              Required field
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
