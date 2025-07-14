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
import CreatableSelect from "react-select/creatable";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

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
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [isPublic, setIsPublic] = useState(true);

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

    // Check question type limits
    const typeCounts = {};
    questions.forEach(q => {
      typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
    });

    const limitedTypes = ['text', 'textarea', 'integer', 'checkbox'];
    const maxPerType = 4;
    
    for (const type of limitedTypes) {
      if (typeCounts[type] > maxPerType) {
        toast.error(`Maximum ${maxPerType} questions allowed for type: ${type}`);
        return;
      }
    }

    if (onSubmit) {
      onSubmit({
        title,
        description,
        topic,
        questions,
        tags: tags.map(t => t.value),
        accessUsers: allowedUsers.map(u => u.value),
        isPublic
      });
      setTitle("");
      setDescription("");
      setTopic("");
      setQuestions([]);
      setTags([]);
      setIsPublic(true);
    }
  };

  const fetchTagOptions = async (inputValue) => {
    try {
      const res = await fetch(`${API_URL}/api/tags?search=${inputValue}`);
      const data = await res.json();
      return data.map(tag => ({ label: tag.name, value: tag.name }));
    } catch (e) {
      return [];
    }
  };

  // Token de autenticación, ajústalo según tu contexto de auth
  const token = localStorage.getItem("token");

  const fetchUserOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return [];
    const res = await fetch(`${API_URL}/api/users/autocomplete?q=${inputValue}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(user => ({
      label: `${user.username} (${user.email})`,
      value: user.id,
      email: user.email,
      username: user.username
    }));
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
      <select
        className="w-full mb-6 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
        value={topic}
        onChange={e => setTopic(e.target.value)}
        required
      >
        <option value="">Select a topic</option>
        <option value="Education">Education</option>
        <option value="Quiz">Quiz</option>
        <option value="Other">Other</option>
      </select>

      <div className="mb-6">
        <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">Tags</label>
        <CreatableSelect
          isMulti
          value={tags}
          onChange={setTags}
          loadOptions={fetchTagOptions}
          onCreateOption={async (inputValue) => {
            const newTag = inputValue.trim().toLowerCase();
            if (newTag.length < 2 || newTag.length > 64) {
              toast.error("Tag must be between 2 and 64 characters.");
              return;
            }
            if (tags.some(t => t.value === newTag)) {
              toast.error("Tag already added.");
              return;
            }
            // POST al backend
            const res = await fetch(`${API_URL}/api/tags`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: newTag })
            });
            if (res.ok) {
              setTags([...tags, { label: newTag, value: newTag }]);
            } else {
              toast.error("Could not create tag.");
            }
          }}
          placeholder="Type to search or create tags..."
          className="react-select-container"
          classNamePrefix="react-select"
          noOptionsMessage={() => "No matches found"}
          isClearable={false}
          formatCreateLabel={inputValue => `Create tag: "${inputValue}"`}
        />
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">
          Template Visibility
        </label>
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="visibility"
              checked={isPublic}
              onChange={() => {
                setIsPublic(true);
                setAllowedUsers([]); // Clear allowed users when making public
              }}
              className="mr-2"
            />
            <span className="text-gray-700 dark:text-gray-200">Public</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="visibility"
              checked={!isPublic}
              onChange={() => setIsPublic(false)}
              className="mr-2"
            />
            <span className="text-gray-700 dark:text-gray-200">Private</span>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">
          Allowed users (for restricted templates)
        </label>
        {!isPublic && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Select specific users who can access this private template
          </p>
        )}
        {isPublic && (
          <p className="text-sm text-green-600 dark:text-green-400 mb-2">
            This template will be publicly accessible to all users
          </p>
        )}
        <AsyncSelect
          isMulti
          cacheOptions
          loadOptions={fetchUserOptions}
          defaultOptions={false}
          value={allowedUsers}
          onChange={setAllowedUsers}
          placeholder="Type name or email to add users..."
          className="react-select-container"
          classNamePrefix="react-select"
          noOptionsMessage={() => "No users found"}
          isDisabled={isPublic}
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