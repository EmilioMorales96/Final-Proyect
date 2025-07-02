export default function FileInput({ question, setAnswer, disabled }) {
  return (
    <input
      type="file"
      className="block w-full text-sm text-gray-900 border border-gray-200 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-600"
      accept={question.accept || ""}
      multiple={!!question.multiple}
      onChange={e => setAnswer(question.id, question.multiple ? Array.from(e.target.files) : e.target.files[0])}
      required={question.required}
      disabled={disabled}
    />
  );
}