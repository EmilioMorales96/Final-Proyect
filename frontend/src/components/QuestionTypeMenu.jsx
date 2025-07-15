import React, { useEffect, useRef } from "react";
import { BsInputCursor, BsTextareaResize } from "react-icons/bs";
import { AiOutlineNumber } from "react-icons/ai";
import { FaRegCheckSquare, FaListUl, FaChevronDown } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const QUESTION_TYPES = [
  { 
    type: "text", 
    label: "Short Text", 
    icon: BsInputCursor, 
    description: "Single line text input",
    color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
  },
  { 
    type: "textarea", 
    label: "Long Text", 
    icon: BsTextareaResize, 
    description: "Multi-line text area",
    color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
  },
  { 
    type: "integer", 
    label: "Number", 
    icon: AiOutlineNumber, 
    description: "Numeric input only",
    color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
  },
  { 
    type: "checkbox", 
    label: "Checkboxes", 
    icon: FaRegCheckSquare, 
    description: "Multiple selection options",
    color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
  },
  { 
    type: "radio", 
    label: "Multiple Choice", 
    icon: FaListUl, 
    description: "Single selection from options",
    color: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
  },
  { 
    type: "select", 
    label: "Dropdown", 
    icon: FaChevronDown, 
    description: "Dropdown selection menu",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
  },
];

export default function QuestionTypeMenu({ onSelect, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div 
      ref={menuRef}
      className="absolute z-50 mt-2 right-0 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-3 animate-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Add Question
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <MdClose className="text-lg" />
        </button>
      </div>

      {/* Question Types Grid */}
      <div className="p-2 space-y-1">
        {QUESTION_TYPES.map(q => (
          <button
            key={q.type}
            className={`w-full flex items-center p-4 rounded-xl border transition-all duration-200 group ${q.color} dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600`}
            onClick={() => { onSelect(q.type); onClose(); }}
            type="button"
          >
            <div className="flex-shrink-0 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 mr-4">
              <q.icon className="text-xl" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm group-hover:scale-105 transition-transform">
                {q.label}
              </div>
              <div className="text-xs opacity-75 mt-1">
                {q.description}
              </div>
            </div>
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Choose a question type to add to your template
        </p>
      </div>
    </div>
  );
}