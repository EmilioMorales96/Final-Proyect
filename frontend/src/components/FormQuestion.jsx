import { QUESTION_TYPE_COMPONENTS } from "./questionTypes";
import { FiTrash2, FiPlus, FiChevronDown } from "react-icons/fi";
import clsx from "clsx";
import { QUESTION_TYPE_ICONS } from "../constants/questionTypeIcons";
import { QUESTION_TYPES } from "../constants/questionTypes";
import { useState } from "react";

export default function FormQuestion({
  mode = "fill",
  question,
  idx,
  onChange,
  onRemove,
  onOptionChange,
  onAddOption,
  onDeleteOption,
  answer,
  setAnswer,
  flash,
  error,
}) {
  const InputComponent = QUESTION_TYPE_COMPONENTS[question.type];

  // Congfiguration specific to each question type
  const renderBuilderConfig = () => {
    switch (question.type) {
      case "radio":
      case "checkbox":
      case "select":
        return (
          <div className="space-y-2">
            {question.options.map((opt, optIdx) => (
              <div key={optIdx} className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={opt}
                  onChange={e => onOptionChange(idx, optIdx, e.target.value)}
                  placeholder={`Opción ${optIdx + 1}`}
                  required
                />
                <button
                  type="button"
                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  onClick={() => onDeleteOption(idx, optIdx)}
                  disabled={question.options.length <= 1}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold text-sm"
              onClick={() => onAddOption(idx)}
            >
              <FiPlus /> New option
            </button>
          </div>
        );
      case "linear":
        return (
          <div className="flex gap-4 items-center mt-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Mín:
              <input
                type="number"
                min={1}
                max={question.max || 10}
                value={question.min || 1}
                onChange={e => onChange(idx, "min", Number(e.target.value))}
                className="ml-2 w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </label>
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Máx:
              <input
                type="number"
                min={question.min || 1}
                max={10}
                value={question.max || 5}
                onChange={e => onChange(idx, "max", Number(e.target.value))}
                className="ml-2 w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </label>
          </div>
        );
      case "rating":
        return (
          <div className="flex gap-4 items-center mt-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Máx Stars:
              <input
                type="number"
                min={1}
                max={10}
                value={question.max || 5}
                onChange={e => onChange(idx, "max", Number(e.target.value))}
                className="ml-2 w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </label>
          </div>
        );
      case "grid_radio":
      case "grid_checkbox":
        return (
          <div className="flex flex-col gap-2 mt-2">
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Row</span>
              {question.rows?.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-2 mt-1">
                  <input
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={row}
                    onChange={e => {
                      const newRows = [...question.rows];
                      newRows[rowIdx] = e.target.value;
                      onChange(idx, "rows", newRows);
                    }}
                    placeholder={`Fila ${rowIdx + 1}`}
                    required
                  />
                  <button
                    type="button"
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    onClick={() => {
                      const newRows = question.rows.filter((_, i) => i !== rowIdx);
                      onChange(idx, "rows", newRows);
                    }}
                    disabled={question.rows.length <= 1}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold text-sm"
                onClick={() => onChange(idx, "rows", [...(question.rows || [""]), ""])}
              >
                <FiPlus /> New Row
              </button>
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Columns</span>
              {question.columns?.map((col, colIdx) => (
                <div key={colIdx} className="flex gap-2 mt-1">
                  <input
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={col}
                    onChange={e => {
                      const newCols = [...question.columns];
                      newCols[colIdx] = e.target.value;
                      onChange(idx, "columns", newCols);
                    }}
                    placeholder={`Columna ${colIdx + 1}`}
                    required
                  />
                  <button
                    type="button"
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    onClick={() => {
                      const newCols = question.columns.filter((_, i) => i !== colIdx);
                      onChange(idx, "columns", newCols);
                    }}
                    disabled={question.columns.length <= 1}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold text-sm"
                onClick={() => onChange(idx, "columns", [...(question.columns || [""]), ""])}
              >
                <FiPlus /> New Column
              </button>
            </div>
          </div>
        );
      case "file":
        return (
          <div className="mt-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Types allowed (separated by comma):
              <input
                type="text"
                value={question.accept || ""}
                onChange={e => onChange(idx, "accept", e.target.value)}
                className="ml-2 w-48 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                placeholder="Ej: .pdf,.jpg,.png"
              />
            </label>
            <label className="ml-4 text-sm text-gray-700 dark:text-gray-200">
              Multiple:
              <input
                type="checkbox"
                checked={!!question.multiple}
                onChange={e => onChange(idx, "multiple", e.target.checked)}
                className="ml-2 accent-purple-600"
              />
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  const [typeMenuOpen, setTypeMenuOpen] = useState(false);

  return (
    <div
      className={clsx(
        "bg-white dark:bg-gray-800 border rounded-2xl p-6 relative group transition-all duration-300 mb-6 shadow-lg animate-fade-in",
        error && "border-red-500 ring-2 ring-red-300",
        "hover:shadow-2xl hover:border-purple-400 dark:hover:border-purple-500",
        flash && "ring-4 ring-purple-400 border-purple-400 dark:ring-purple-700 dark:border-purple-500 animate-bounce-in",
        mode === "builder" && "border-2 border-gray-200 dark:border-gray-700"
      )}
      style={{
        boxShadow: flash
          ? "0 0 0 6px #a78bfa88, 0 12px 36px 0 rgba(80,0,120,0.22)"
          : undefined,
        zIndex: typeMenuOpen ? 100 : undefined,
      }}
    >
      {/* Visual confirmation of movement */}
      {flash && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full shadow-lg text-sm font-bold animate-fade-in-up z-50 pointer-events-none">
          Answer Moved!
        </div>
      )}
      {mode === "builder" && (
        <button
          type="button"
          onClick={() => onRemove(idx)}
          className="absolute top-3 right-3 p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow transition focus:outline-none focus:ring-2 focus:ring-red-400"
          title="Eliminar pregunta"
        >
          <FiTrash2 />
        </button>
      )}
      <div>
        <label className="block text-gray-800 dark:text-gray-100 font-bold mb-2 text-lg tracking-tight">
          {mode === "builder" ? `Pregunta ${idx + 1}` : question.label}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {mode === "builder" ? (
          <>
            <input
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-3 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:border-purple-500 dark:focus:ring-purple-900 transition"
              value={question.label}
              onChange={e => onChange(idx, "label", e.target.value)}
              placeholder="Texto de la pregunta"
              required
            />
            {/* Custom select with icons and animation */}
            <div className="relative mb-3">
              <button
                type="button"
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:border-purple-500 dark:focus:ring-purple-900 transition font-medium"
                onClick={() => setTypeMenuOpen((v) => !v)}
                onBlur={() => setTimeout(() => setTypeMenuOpen(false), 150)}
                tabIndex={0}
              >
                {(() => {
                  const Icon = QUESTION_TYPE_ICONS[question.type];
                  return Icon ? <Icon className="text-xl text-purple-500" /> : null;
                })()}
                <span className="flex-1 text-left">
                  {QUESTION_TYPES.find((t) => t.value === question.type)?.label || "Tipo"}
                </span>
                <FiChevronDown className={clsx("ml-2 transition-transform", typeMenuOpen && "rotate-180")}/>
              </button>
              <div
                className={clsx(
                  "absolute left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl mt-2 overflow-hidden transition-all duration-200 origin-top",
                  typeMenuOpen ? "scale-y-100 opacity-100 pointer-events-auto z-[200]" : "scale-y-95 opacity-0 pointer-events-none z-0"
                )}
                style={{ transformOrigin: "top", zIndex: 200 }}
              >
                {QUESTION_TYPES.map((type) => {
                  const Icon = QUESTION_TYPE_ICONS[type.value];
                  return (
                    <button
                      key={type.value}
                      type="button"
                      className={clsx(
                        "w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900 transition text-gray-800 dark:text-gray-100",
                        question.type === type.value && "bg-purple-100 dark:bg-purple-800 font-bold"
                      )}
                      onClick={() => {
                        onChange(idx, "type", type.value);
                        setTypeMenuOpen(false);
                      }}
                    >
                      {Icon && <Icon className="text-lg text-purple-500" />}
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {renderBuilderConfig()}
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={question.required}
                onChange={e => onChange(idx, "required", e.target.checked)}
                id={`required-${question.id}`}
                className="accent-purple-600 w-4 h-4"
              />
              <label htmlFor={`required-${question.id}`} className="text-gray-700 dark:text-gray-200 text-sm">
                Requerida
              </label>
            </div>
          </>
        ) : (
          InputComponent && (
            <InputComponent
              question={question}
              answer={answer}
              setAnswer={setAnswer}
              disabled={mode === "preview"}
            />
          )
        )}
        {mode === "fill" && error && (
          <div className="mt-2 text-sm text-red-600 font-semibold">{error}</div>
        )}
      </div>
    </div>
  );
}