import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence } from "framer-motion";
import { FiMove, FiChevronUp, FiChevronDown, FiTrash2, FiCircle, FiSquare } from "react-icons/fi";
import Button from "./Button";
import Tooltip from "./Tooltip";

const SortableQuestion = ({ question, removeQuestion }) => {
  const {
    attributes,
    setNodeRef,
    transform,
    isDragging
  } = useSortable({ id: question.id });
  
  const [isRemoving, setIsRemoving] = useState(false);
  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => removeQuestion(question.id), 300);
  };

  if (isRemoving) return (
    <div 
      ref={setNodeRef} 
      style={{ transform: CSS.Transform.toString(transform) }}
      className="relative p-4 mb-4 rounded-lg border opacity-0 -translate-x-24 transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
    />
  );

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform) }}
      className={`relative p-4 mb-4 rounded-lg border transition-all ${
        isDragging 
          ? 'shadow-lg opacity-80 z-[1000] border-blue-500' 
          : 'shadow-sm z-auto border-gray-200 dark:border-gray-600'
      } bg-white dark:bg-gray-800`}
      {...attributes}
    >
      {/* Example delete button to use handleRemove */}
      <button
        type="button"
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        onClick={handleRemove}
        aria-label="Delete question"
      >
        <FiTrash2 />
      </button>
      {/* Resto del componente... */}
    </div>
  );
};

export default SortableQuestion;