import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FormQuestion from "../components/FormQuestion";

export default function FillFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState(null);
  const [answers, setAnswers] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Load template
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`/api/templates/${id}`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setTemplate(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load the form");
        setLoading(false);
      });
  }, [id]);

  // Set answer
  const setAnswer = (qid, value) => setAnswers(ans => ({ ...ans, [qid]: value }));

  // Type-specific validation for each question
  function getQuestionError(question, answer) {
    if (question.required) {
      if (["text", "textarea"].includes(question.type)) {
        if (!answer || !answer.trim()) return "This field is required.";
      }
      if (["radio", "select"].includes(question.type)) {
        if (!answer || answer === "") return "Select an option.";
      }
      if (question.type === "checkbox") {
        if (!Array.isArray(answer) || answer.length === 0) return "Select at least one option.";
      }
      if (["linear", "rating"].includes(question.type)) {
        if (answer === undefined || answer === null || answer === "") return "Select a value.";
      }
      if (question.type === "grid_radio") {
        if (
          !answer ||
          typeof answer !== "object" ||
          Object.keys(answer).length !== (question.rows?.length || 0) ||
          Object.values(answer).some((v) => !v || v === "")
        ) {
          return "Answer all rows.";
        }
      }
      if (question.type === "grid_checkbox") {
        if (
          !answer ||
          typeof answer !== "object" ||
          Object.keys(answer).length !== (question.rows?.length || 0) ||
          Object.values(answer).some((arr) => !Array.isArray(arr) || arr.length === 0)
        ) {
          return "Select at least one option per row.";
        }
      }
      if (question.type === "file") {
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
          return "Attach a file.";
        }
      }
    }
    // You can add more type-specific validations here (e.g., min/max for linear, rating, etc.)
    return null;
  }

  // Submit answers
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    template.questions.forEach((q) => {
      const err = getQuestionError(q, answers[q.id]);
      if (err) errors[q.id] = err;
    });
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please answer all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          templateId: Number(id),
          answers,
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      toast.success("Answers submitted!");
      setTimeout(() => navigate("/forms"), 1500);
    } catch {
      toast.error("Error submitting answers");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="text-lg text-gray-500 dark:text-gray-300 animate-pulse">Loading...</span>
      </div>
    );
  if (!template)
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="text-lg text-gray-500 dark:text-gray-300">Form not found</span>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">{template.title}</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-300">{template.description}</p>
        {success && (
          <div className="mb-4 p-4 rounded bg-green-100 text-green-800 font-semibold text-center">
            Your answers have been saved successfully!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          {template.questions.map((q, idx) => (
            <FormQuestion
              key={q.id}
              mode="fill"
              question={q}
              idx={idx}
              answer={answers[q.id]}
              setAnswer={setAnswer}
              error={fieldErrors[q.id]}
            />
          ))}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-800 text-white font-bold text-lg shadow hover:from-green-700 hover:to-green-900 transition-all"
            >
            Submit answers
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}