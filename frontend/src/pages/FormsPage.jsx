import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // <-- Import your auth hook
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import FormQuestion from "../components/FormQuestion";
import DraggableQuestion from "../components/DraggableQuestion";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const defaultQuestion = () => ({
  id: Date.now() + Math.random(),
  type: "text",
  label: "",
  required: false,
  options: [""],
});

export default function FormsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // <-- Get user from auth context

  // Detect mode based on the route
  let mode = "create";
  if (location.pathname.endsWith("/edit")) mode = "builder";
  if (location.pathname.endsWith("/fill")) mode = "fill";

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [lastDroppedIdx, setLastDroppedIdx] = useState(null);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [loadError, setLoadError] = useState(false);

  // Drag & Drop
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event) => {
    const { active } = event;
    const idx = questions.findIndex((q) => q.id.toString() === active.id);
    setActiveQuestion(questions[idx]);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveQuestion(null);
    if (active && over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id.toString() === active.id);
      const newIndex = questions.findIndex((q) => q.id.toString() === over.id);
      setQuestions((qs) => arrayMove(qs, oldIndex, newIndex));
      setLastDroppedIdx(newIndex);
      setTimeout(() => setLastDroppedIdx(null), 500);
    }
  };

  // Load template or form for editing/filling
  useEffect(() => {
    if (id && mode !== "create") {
      setLoading(true);
      setLoadError(false);
      const token = localStorage.getItem("token");
      fetch(
        mode === "fill"
          ? `${API_URL}/api/templates/${id}`
          : `${API_URL}/api/forms/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data) => {
          setTitle(data.title || "");
          setDescription(data.description || "");
          setQuestions(data.questions || []);
        })
        .catch(() => {
          setLoadError(true);
          toast.error("Failed to load the form");
        })
        .finally(() => setLoading(false));
    }
  }, [id, mode]);

  // Builder: editing functions
  const addQuestion = () => setQuestions((qs) => [...qs, defaultQuestion()]);
  const removeQuestion = (idx) => setQuestions((qs) => qs.filter((_, i) => i !== idx));
  const updateQuestion = (idx, field, value) => {
    setQuestions((qs) =>
      qs.map((q, i) => {
        if (i !== idx) return q;
        // Change to grid: initialize rows/columns
        if (field === "type" && (value === "grid_radio" || value === "grid_checkbox")) {
          return {
            ...q,
            type: value,
            rows: ["Row 1", "Row 2"],
            columns: ["Column 1", "Column 2"],
            min: undefined,
            max: undefined,
            accept: undefined,
            multiple: undefined,
          };
        }
        // Change to linear: initialize min/max and clear other fields
        if (field === "type" && value === "linear") {
          return {
            ...q,
            type: value,
            min: 1,
            max: 5,
            rows: undefined,
            columns: undefined,
            accept: undefined,
            multiple: undefined,
          };
        }
        // Change to rating: initialize max and clear other fields
        if (field === "type" && value === "rating") {
          return {
            ...q,
            type: value,
            max: 5,
            min: undefined,
            rows: undefined,
            columns: undefined,
            accept: undefined,
            multiple: undefined,
          };
        }
        // Change to file: initialize accept/multiple and clear other fields
        if (field === "type" && value === "file") {
          return {
            ...q,
            type: value,
            accept: "",
            multiple: false,
            min: undefined,
            max: undefined,
            rows: undefined,
            columns: undefined,
          };
        }
        // Change to simple types: clear all special fields
        if (
          field === "type" &&
          !["grid_radio", "grid_checkbox", "linear", "rating", "file"].includes(value)
        ) {
          const { ...rest } = q;
          return { ...rest, type: value };
        }
        // Normal change for any other field
        return { ...q, [field]: value };
      })
    );
  };
  const updateOption = (qIdx, optIdx, value) =>
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((o, oi) => (oi === optIdx ? value : o)) }
          : q
      )
    );
  const addOption = (qIdx) =>
    setQuestions((qs) =>
      qs.map((q, i) => (i === qIdx ? { ...q, options: [...q.options, ""] } : q))
    );
  const removeOption = (qIdx, optIdx) =>
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.filter((_, oi) => oi !== optIdx) }
          : q
      )
    );

  // Filler: set answers
  const setAnswer = (qid, value) => setAnswers((ans) => ({ ...ans, [qid]: value }));

  // Save template (create or edit)
  async function saveTemplateToBackend() {
    const token = localStorage.getItem("token");
    const payload = {
      title,
      description,
      topic: "General",
      questions,
    };
    const res = await fetch(`${API_URL}/api/templates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error saving template: ${res.status} - ${text}`);
    }
    return await res.json();
  }

  // Save answers (filler)
  async function sendAnswersToBackend() {
    const token = localStorage.getItem("token");
    const templateId = Number(id);
    const res = await fetch(`${API_URL}/api/forms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        templateId,
        answers,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error submitting answers: ${res.status} - ${text}`);
    }
    return await res.json();
  }

  // Save template (builder)
  const handleSave = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    setLoading(true);
    try {
      await saveTemplateToBackend();
      toast.success("Template saved successfully");
      navigate("/forms");
    } catch (err) {
      toast.error("Error saving template");
    } finally {
      setLoading(false);
    }
  };

  // Submit answers (filler)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateAnswers();
    if (error) {
      toast.error(error);
      return;
    }
    setLoading(true);
    try {
      await sendAnswersToBackend();
      toast.success("Answers submitted successfully");
      navigate("/forms");
    } catch (err) {
      toast.error("Error submitting answers");
    } finally {
      setLoading(false);
    }
  };

  function validateForm() {
    if (!title.trim()) return "The form must have a title.";
    if (questions.length === 0) return "Add at least one question.";
    for (const q of questions) {
      if (!q.label || !q.label.trim()) return "All questions must have text.";
      if (["radio", "checkbox", "select"].includes(q.type)) {
        if (!q.options || q.options.length < 1 || q.options.some((opt) => !opt.trim())) {
          return "All option questions must have at least one valid option.";
        }
      }
      if (["grid_radio", "grid_checkbox"].includes(q.type)) {
        if (!q.rows || q.rows.length < 1 || q.rows.some((r) => !r.trim())) {
          return "Grids must have at least one valid row.";
        }
        if (!q.columns || q.columns.length < 1 || q.columns.some((c) => !c.trim())) {
          return "Grids must have at least one valid column.";
        }
      }
    }
    return null;
  }

  function validateAnswers() {
    for (const q of questions) {
      if (q.required) {
        const ans = answers[q.id];
        if (
          ans === undefined ||
          ans === "" ||
          (Array.isArray(ans) && ans.length === 0) ||
          (["grid_radio", "grid_checkbox"].includes(q.type) &&
            (!ans || Object.values(ans).length === 0 || Object.values(ans).some((v) => !v || (Array.isArray(v) && v.length === 0))))
        ) {
          return `Please answer the question: "${q.label}"`;
        }
      }
    }
    return null;
  }

  // Add this helper
  const isActionAllowed = user && user.token;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="fixed inset-0 z-0 forms-animated-bg" />
      <div className="relative z-10 max-w-3xl mx-auto py-10 px-2">
        {mode !== "fill" && (
          <div className="flex justify-end mb-4">
            {isActionAllowed && (
              <button
                type="button"
                onClick={() => setPreview((p) => !p)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition"
                disabled={loading}
              >
                {preview ? "Exit preview" : "Preview"}
              </button>
            )}
          </div>
        )}
        {preview && (
          <div className="mb-4 p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-center font-semibold">
            You are in preview mode
          </div>
        )}
        {loading && (
          <div className="mb-4 text-center text-indigo-700 dark:text-indigo-200 font-semibold">
            Loading...
          </div>
        )}
        {loadError ? (
          <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-center font-semibold">
            Failed to load the form.
          </div>
        ) : (
          <form
            onSubmit={
              preview
                ? (e) => e.preventDefault()
                : mode === "fill"
                ? (e) => {
                    if (!isActionAllowed) {
                      e.preventDefault();
                      return toast.error("You must be logged in to submit answers.");
                    }
                    handleSubmit(e);
                  }
                : (e) => {
                    if (!isActionAllowed) {
                      e.preventDefault();
                      return toast.error("You must be logged in to save forms.");
                    }
                    handleSave(e);
                  }
            }
            className="dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-8"
          >
            <div>
              <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">
                Form title
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g.: Satisfaction survey"
                required
                disabled={mode === "fill" || loading}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose of the form"
                rows={2}
                disabled={mode === "fill" || loading}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Questions</h2>
                {mode !== "fill" && !preview && (
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold shadow transition"
                    disabled={loading}
                  >
                    Add question
                  </button>
                )}
              </div>
              {/* Visual container for questions: contained area, no internal overflow */}
              <div className="relative">
                {mode !== "fill" && !preview ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={questions.map((q) => q.id.toString())}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex flex-col gap-6 py-2">
                        {questions.map((q, idx) => (
                          <DraggableQuestion key={q.id} id={q.id.toString()}>
                            {() => (
                              <FormQuestion
                                mode="builder"
                                question={q}
                                idx={idx}
                                onChange={updateQuestion}
                                onRemove={removeQuestion}
                                onOptionChange={updateOption}
                                onAddOption={addOption}
                                onDeleteOption={removeOption}
                                flash={lastDroppedIdx === idx}
                              />
                            )}
                          </DraggableQuestion>
                        ))}
                      </div>
                    </SortableContext>
                    <DragOverlay>
                      {activeQuestion ? (
                        <div className="pointer-events-none">
                          <FormQuestion
                            mode="builder"
                            question={activeQuestion}
                            idx={questions.findIndex((q) => q.id === activeQuestion.id)}
                            onChange={() => {}}
                            onRemove={() => {}}
                            onOptionChange={() => {}}
                            onAddOption={() => {}}
                            onDeleteOption={() => {}}
                            flash={false}
                          />
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                ) : (
                  <div className="space-y-6 py-2">
                    {questions.length === 0 && (
                      <div className="text-gray-400 dark:text-gray-500 italic mb-6">No questions yet.</div>
                    )}
                    {questions.map((q, idx) => (
                      <FormQuestion
                        key={q.id}
                        mode="fill"
                        question={q}
                        idx={idx}
                        answer={answers[q.id]}
                        setAnswer={setAnswer}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-800 text-white font-bold text-lg shadow hover:from-purple-800 hover:to-indigo-900 transition-all"
                disabled={loading || preview || !isActionAllowed}
                title={!isActionAllowed ? "You must be logged in to perform this action." : ""}
              >
                {preview
                  ? "Preview active"
                  : mode === "fill"
                  ? "Submit answers"
                  : "Save form"}
              </button>
            </div>
            {!isActionAllowed && (
              <div className="text-center text-red-600 dark:text-red-400 font-medium text-sm py-3 rounded bg-red-50 dark:bg-red-900/30 animate-fade-in">
                You must be logged in to {mode === "fill" ? "submit answers" : "save forms"}.
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}