export default function DateInput({ question, answer, setAnswer, disabled }) {
  return (
    <input
      type="date"
      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      value={answer || ""}
      onChange={e => setAnswer(question.id, e.target.value)}
      required={question.required}
      disabled={disabled}
    />
  );
}