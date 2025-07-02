export default function LinearScaleInput({ question, answer, setAnswer, disabled }) {
  const min = question.min || 1;
  const max = question.max || 5;
  return (
    <div className="flex gap-2 items-center">
      {[...Array(max - min + 1)].map((_, i) => (
        <label key={i} className="flex flex-col items-center">
          <input
            type="radio"
            name={`linear-${question.id}`}
            value={min + i}
            checked={answer == min + i}
            onChange={() => setAnswer(question.id, min + i)}
            disabled={disabled}
            className="accent-purple-600"
          />
          <span className="text-xs">{min + i}</span>
        </label>
      ))}
    </div>
  );
}