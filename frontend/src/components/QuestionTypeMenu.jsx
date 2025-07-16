import React, { useEffect, useRef } from "react";
import { BsInputCursor, BsTextareaResize } from "react-icons/bs";
import { AiOutlineNumber } from "react-icons/ai";
import { FaRegCheckSquare, FaListUl, FaChevronDown, FaStar, FaUpload } from "react-icons/fa";
import { MdClose, MdRadioButtonChecked, MdGrid3X3, MdGridOn } from "react-icons/md";
import { BiSlider } from "react-icons/bi";
import { getQuestionTypeConfigs, canAddQuestionType } from "../utils/questionValidation";

/**
 * Icon mapping for question types
 */
const QUESTION_ICONS = {
  text: BsInputCursor,
  textarea: BsTextareaResize, 
  integer: AiOutlineNumber,
  checkbox: FaRegCheckSquare,
  radio: MdRadioButtonChecked,
  select: FaChevronDown,
  linear: BiSlider,
  rating: FaStar,
  grid_radio: MdGrid3X3,
  grid_checkbox: MdGridOn,
  file: FaUpload
};

/**
 * Color mapping for question types
 */
const QUESTION_COLORS = {
  blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700",
  green: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700",
  purple: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700",
  orange: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700",
  teal: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-700",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-700",
  pink: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-700",
  yellow: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700",
  red: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700",
  cyan: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-700",
  gray: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700"
};
/**
 * QuestionTypeMenu - Enhanced dropdown menu for selecting question types
 * Shows question limits, current usage, and availability
 * 
 * Features:
 * - Visual limit indicators
 * - Current usage tracking
 * - Disabled state for exceeded limits
 * - Limited vs Unlimited question types
 * - Click outside to close
 * - Escape key to close
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSelect - Callback when question type is selected
 * @param {Function} props.onClose - Callback to close the menu
 * @param {Array} props.questions - Current questions array for limit checking
 * @returns {JSX.Element} Enhanced question type selection dropdown
 */
export default function QuestionTypeMenu({ onSelect, onClose, questions = [] }) {
  const menuRef = useRef(null);
  const questionConfigs = getQuestionTypeConfigs();

  // Calculate current usage for each question type
  const getQuestionCount = (type) => {
    return questions.filter(q => q.type === type).length;
  };

  // Check if question type can be added
  const canAdd = (type) => {
    return canAddQuestionType(questions, type);
  };

  // Separate limited and unlimited question types
  const limitedTypes = questionConfigs.filter(config => config.limit !== null);
  const unlimitedTypes = questionConfigs.filter(config => config.limit === null);

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

  // Render question type button
  const renderQuestionButton = (config, isLimited = false) => {
    const Icon = QUESTION_ICONS[config.type];
    const currentCount = getQuestionCount(config.type);
    const canAddType = canAdd(config.type);
    const colorClass = QUESTION_COLORS[config.color] || QUESTION_COLORS.gray;
    
    return (
      <button
        key={config.type}
        className={`w-full flex items-center p-3 rounded-xl border transition-all duration-200 group relative ${
          canAddType 
            ? colorClass 
            : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500 dark:border-gray-600'
        }`}
        onClick={() => { 
          if (canAddType) {
            onSelect(config.type); 
            onClose();
          }
        }}
        disabled={!canAddType}
        type="button"
      >
        <div className={`flex-shrink-0 p-2 rounded-lg mr-3 ${
          canAddType 
            ? 'bg-white/80 dark:bg-gray-800/80' 
            : 'bg-gray-100 dark:bg-gray-700'
        }`}>
          <Icon className="text-lg" />
        </div>
        
        <div className="flex-1 text-left">
          <div className="font-semibold text-sm">
            {config.label}
          </div>
          <div className="text-xs opacity-75 mt-1">
            {config.description}
          </div>
        </div>

        {/* Limit indicator for limited types */}
        {isLimited && (
          <div className="flex-shrink-0 text-right">
            <div className={`text-xs font-medium ${
              currentCount >= config.limit 
                ? 'text-red-600 dark:text-red-400' 
                : canAddType 
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-400'
            }`}>
              {currentCount}/{config.limit}
            </div>
            <div className="text-xs opacity-75">
              Max {config.limit}
            </div>
          </div>
        )}

        {/* Unlimited indicator */}
        {!isLimited && canAddType && (
          <div className="flex-shrink-0 text-right">
            <div className="text-xs font-medium text-green-600 dark:text-green-400">
              {currentCount}
            </div>
            <div className="text-xs opacity-75">
              No limit
            </div>
          </div>
        )}

        {/* Add icon */}
        {canAddType && (
          <div className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        )}
      </button>
    );
  };

  return (
    <div 
      ref={menuRef}
      className="absolute z-50 mt-2 right-0 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-4 animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto"
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

      {/* Limited Question Types Section */}
      <div className="px-4 py-3">
        <div className="flex items-center mb-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Limited Question Types (Max 4 each)
          </h4>
        </div>
        <div className="space-y-2">
          {limitedTypes.map(config => renderQuestionButton(config, true))}
        </div>
      </div>

      {/* Unlimited Question Types Section */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-3">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Unlimited Question Types
          </h4>
        </div>
        <div className="space-y-2">
          {unlimitedTypes.map(config => renderQuestionButton(config, false))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Total questions: {questions.length}</span>
          <span>Choose a type to add</span>
        </div>
      </div>
    </div>
  );
}