import React from 'react';
import { QUESTION_TYPE_COMPONENTS } from './questionTypes';

/**
 * QuestionRenderer - Renders questions in different modes
 * @param {Object} question - The question object
 * @param {string} mode - 'edit' | 'answer' | 'preview'
 * @param {*} answer - Current answer (for answer mode)
 * @param {Function} setAnswer - Function to set answer (for answer mode)
 * @param {boolean} disabled - Whether the input is disabled
 * @param {Object} editProps - Props for edit mode (onChange, onOptionChange, etc.)
 */
export default function QuestionRenderer({ 
  question, 
  mode = 'preview', 
  answer, 
  setAnswer, 
  disabled = false
}) {
  // For answer mode, use the existing question type components
  if (mode === 'answer') {
    const QuestionComponent = QUESTION_TYPE_COMPONENTS[question.type];
    
    if (!QuestionComponent) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">Unsupported question type: {question.type}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {question.title || question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            {question.questionText && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {question.questionText}
              </p>
            )}
            {question.description && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                {question.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <QuestionComponent
            question={question}
            answer={answer}
            setAnswer={setAnswer}
            disabled={disabled}
          />
        </div>
      </div>
    );
  }

  // For preview mode, show a read-only version
  if (mode === 'preview') {
    return (
      <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {question.title}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            {question.questionText && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {question.questionText}
              </p>
            )}
            {question.description && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                {question.description}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 ml-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200">
              {question.type}
            </span>
          </div>
        </div>
        
        {/* Show options for choice-based questions */}
        {(question.type === 'radio' || question.type === 'checkbox' || question.type === 'select') && question.options && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Options:</p>
            <ul className="space-y-1">
              {question.options.map((option, index) => (
                <li key={index} className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Show additional settings */}
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          {question.showInTable && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
              Show in table
            </span>
          )}
          {question.required && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200">
              Required
            </span>
          )}
        </div>
      </div>
    );
  }

  // For edit mode, this would be handled by QuestionCard component
  return null;
}
