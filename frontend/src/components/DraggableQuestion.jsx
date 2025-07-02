import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiMove } from "react-icons/fi";
import clsx from "clsx";

export default function DraggableQuestion({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 50 : "auto",
      }}
      className={clsx(
        "relative group",
        isDragging && "shadow-2xl ring-4 ring-purple-300"
      )}
    >
      {/* Handle de arrastre */}
      <button
        type="button"
        tabIndex={0}
        aria-label="Mover pregunta"
        className={clsx(
          "absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center",
          "w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 shadow border border-purple-300 dark:border-purple-700",
          "opacity-80 group-hover:opacity-100 transition cursor-grab active:cursor-grabbing"
        )}
        {...attributes}
        {...listeners}
        style={{
          outline: "none",
          boxShadow: isDragging ? "0 0 0 4px #a78bfa55" : undefined,
        }}
      >
        <FiMove size={18} />
      </button>
      <div className="pl-10">{children({})}</div>
    </div>
  );
}