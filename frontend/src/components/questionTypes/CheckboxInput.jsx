export default function CheckboxInput({ question, answer, setAnswer, disabled }) {
  return (
    <div className="space-y-2">
      {question.options.map((opt, i) => (
        <label key={i} className="flex items-center gap-2">
          <input
            type="checkbox"
            value={opt}
            checked={Array.isArray(answer) && answer.includes(opt)}
            onChange={e => {
              const checked = e.target.checked;
              let newArr = Array.isArray(answer) ? [...answer] : [];
              if (checked) newArr.push(opt);
              else newArr = newArr.filter(o => o !== opt);
              setAnswer(question.id, newArr);
            }}
            disabled={disabled}
            className="accent-purple-600"
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}