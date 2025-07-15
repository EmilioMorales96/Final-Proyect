/**
 * TextareaInput - Multi-line text input component
 * Handles long text responses with auto-resizing
 * 
 * @param {Object} props - Component props
 * @param {Object} props.question - Question configuration object
 * @param {string} props.answer - Current answer value
 * @param {Function} props.setAnswer - Function to update answer
 * @param {boolean} props.disabled - Whether input is disabled
 * @returns {JSX.Element} Textarea input with styling and validation
 */
export default function TextareaInput({ question, answer, setAnswer, disabled }) {
  return (
    <textarea
      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      value={answer || ""}
      onChange={e => setAnswer(question.id, e.target.value)}
      placeholder={question.label}
      required={question.required}
      disabled={disabled}
    />
  );
}