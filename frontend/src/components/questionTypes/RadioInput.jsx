export default function RadioInput({ question, answer, setAnswer, disabled }) {
  return (
    <div className="space-y-2">
      {question.options.map((opt, i) => (
        <label key={i} className="flex items-center gap-2">
          <input
            type="radio"
            name={`radio-${question.id}`}
            value={opt}
            checked={answer === opt}
            onChange={() => setAnswer(question.id, opt)}
            required={question.required}
            disabled={disabled}
            className="accent-purple-600"
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}