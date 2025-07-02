export default function RatingInput({ question, answer, setAnswer, disabled }) {
  const max = question.max || 5;
  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, i) => (
        <button
          key={i}
          type="button"
          className={`text-2xl ${answer > i ? "text-yellow-400" : "text-gray-400"}`}
          onClick={() => setAnswer(question.id, i + 1)}
          disabled={disabled}
        >
          ★
        </button>
      ))}
    </div>
  );
}