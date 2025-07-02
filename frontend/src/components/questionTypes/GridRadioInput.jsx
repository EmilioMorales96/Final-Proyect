export default function GridRadioInput({ question, answer = {}, setAnswer, disabled }) {
  return (
    <table className="min-w-full border border-gray-300 dark:border-gray-600">
      <thead>
        <tr>
          <th></th>
          {question.columns?.map((col, colIdx) => (
            <th key={colIdx} className="px-2 py-1 text-xs">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {question.rows?.map((row, rowIdx) => (
          <tr key={rowIdx}>
            <td className="pr-2 text-xs">{row}</td>
            {question.columns?.map((col, colIdx) => (
              <td key={colIdx} className="text-center">
                <input
                  type="radio"
                  name={`grid-radio-${question.id}-row${rowIdx}`}
                  value={col}
                  checked={answer[rowIdx] === col}
                  onChange={() => setAnswer(question.id, { ...answer, [rowIdx]: col })}
                  disabled={disabled}
                  className="accent-purple-600"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}