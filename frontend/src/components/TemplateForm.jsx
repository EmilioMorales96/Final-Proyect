import { useState, useEffect } from "react";
import QuestionTypeMenu from "./QuestionTypeMenu";
import QuestionCard from "./QuestionCard";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";

const DEFAULT_QUESTION = type => ({
  type,
  title: "",
  questionText: "",
  description: "",
  options: ["", ""],
  showInTable: true,
  required: false,
});

function DraggableQuestion({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  // Animation: scale and shadow when dragging
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 50 : 1,
    boxShadow: isDragging
      ? "0 8px 32px 0 rgba(124,58,237,0.25), 0 0 0 4px #a78bfa"
      : "0 2px 8px 0 rgba(124,58,237,0.08)",
    scale: isDragging ? "1.04" : "1",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`transition-all duration-300 ease-out ${isDragging ? "animate-bounce-slow" : ""}`}
      {...attributes}
    >
      {children({ dragHandleProps: listeners })}
    </div>
  );
}

export default function TemplateForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [lastDroppedIdx, setLastDroppedIdx] = useState(null);
  const [tags, setTags] = useState([]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleAddQuestion = type => {
    setQuestions(qs => [...qs, DEFAULT_QUESTION(type)]);
  };

  const handleQuestionChange = (idx, field, value) => {
    setQuestions(qs =>
      qs.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((o, oi) => (oi === optIdx ? value : o)) }
          : q
      )
    );
  };

  const handleAddOption = qIdx => {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === qIdx ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const handleDeleteOption = (qIdx, optIdx) => {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.filter((_, oi) => oi !== optIdx) }
          : q
      )
    );
  };

  const handleDeleteQuestion = idx => {
    setQuestions(qs => qs.filter((_, i) => i !== idx));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = questions.findIndex((_, i) => i === Number(active.id));
      const newIndex = questions.findIndex((_, i) => i === Number(over.id));
      setQuestions(qs => arrayMove(qs, oldIndex, newIndex));
      setLastDroppedIdx(newIndex);
      setTimeout(() => setLastDroppedIdx(null), 600); // feedback lasts 600ms
    }
  };

  // VALIDATION before calling onSubmit
  const handleSubmit = e => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !topic.trim()) {
      toast.error("Please complete all required fields.");
      return;
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      toast.error("You must add at least one question.");
      return;
    }
    if (questions.some(q => !q.title || !q.questionText)) {
      questions.forEach((q, i) => {
        if (!q.title || !q.questionText) {
          console.warn(`[TemplateForm] Incomplete question #${i + 1}:`, q);
        }
      });
      toast.error("Each question must have a title and question text.");
      return;
    }

    if (onSubmit) {
      onSubmit({
        title,
        description,
        topic,
        questions,
        tags: tags.map(t => t.value)
      });
      setTitle("");
      setDescription("");
      setTopic("");
      setQuestions([]);
      setTags([]);
    }
  };

  const fetchTagOptions = async (inputValue) => {
    try {
      const res = await fetch(`/api/tags?search=${inputValue}`);
      const data = await res.json();
      return data.map(tag => ({ label: tag.name, value: tag.name }));
    } catch (e) {
      return [];
    }
  };

  useEffect(() => {
  }, []);
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-4 sm:p-8 max-w-2xl mx-auto mb-8 w-full"
    >
      <h2 className="text-2xl font-bold mb-6 text-violet-700 dark:text-violet-400">Create new template</h2>
      <input
        type="text"
        placeholder="Template title"
        className="w-full mb-3 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        className="w-full mb-3 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Topic"
        className="w-full mb-6 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
        value={topic}
        onChange={e => setTopic(e.target.value)}
      />

      <div className="mb-6">
        <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">Tags</label>
        <AsyncSelect
          isMulti
          value={tags}
          onChange={setTags}
          loadOptions={fetchTagOptions}
          placeholder="Type to search or create tags..."
          className="react-select-container"
          classNamePrefix="react-select"
          noOptionsMessage={() => "No matches found"}
          isClearable={false}
          formatCreateLabel={inputValue => `Create tag: "${inputValue}"`}
          styles={{
            control: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused
                ? (document.body.classList.contains("dark") ? "#374151" : "#f3f4f6")
                : (document.body.classList.contains("dark") ? "#374151" : "#f3f4f6"),
              borderColor: document.body.classList.contains("dark") ? "#4b5563" : "#e5e7eb",
              color: document.body.classList.contains("dark") ? "#f3f4f6" : "#374151",
              boxShadow: state.isFocused ? "0 0 0 2px #a78bfa" : base.boxShadow,
            }),
            menu: base => ({
              ...base,
              backgroundColor: document.body.classList.contains("dark") ? "#374151" : "#fff",
              color: document.body.classList.contains("dark") ? "#f3f4f6" : "#374151",
            }),
            multiValue: base => ({
              ...base,
              backgroundColor: document.body.classList.contains("dark") ? "#6d28d9" : "#ede9fe",
              color: "#fff",
            }),
            input: base => ({
              ...base,
              color: document.body.classList.contains("dark") ? "#f3f4f6" : "#374151",
            }),
            singleValue: base => ({
              ...base,
              color: document.body.classList.contains("dark") ? "#f3f4f6" : "#374151",
            }),
            placeholder: base => ({
              ...base,
              color: document.body.classList.contains("dark") ? "#a1a1aa" : "#9ca3af",
            }),
          }}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Questions</h3>
        <div className="relative">
          <button
            type="button"
            className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg shadow hover:bg-violet-700 transition"
            onClick={() => setShowMenu(m => !m)}
          >
            + Add question
          </button>
          {showMenu && (
            <QuestionTypeMenu
              onSelect={handleAddQuestion}
              onClose={() => setShowMenu(false)}
            />
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={questions.map((_, i) => i.toString())}
            strategy={verticalListSortingStrategy}
          >
            {questions.length === 0 && (
              <div className="text-gray-400 dark:text-gray-500 italic mb-6">No questions yet.</div>
            )}

            {questions.map((q, idx) => (
              <DraggableQuestion key={idx} id={idx.toString()}>
                {({ dragHandleProps }) => (
                  <QuestionCard
                    question={q}
                    idx={idx}
                    onChange={handleQuestionChange}
                    onOptionChange={handleOptionChange}
                    onAddOption={handleAddOption}
                    onDeleteOption={handleDeleteOption}
                    onDelete={handleDeleteQuestion}
                    dragHandleProps={dragHandleProps}
                    flash={lastDroppedIdx === idx}
                  />
                )}
              </DraggableQuestion>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <button
        type="submit"
        className="mt-4 w-full py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition"
      >
        Create template
      </button>
    </form>
  );
}