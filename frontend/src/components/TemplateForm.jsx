import { useState, useEffect } from "react";
import { MarkdownEditor } from './MarkdownRenderer';
import QuestionTypeMenu from "./QuestionTypeMenu";
import QuestionCard from "./QuestionCard";
import QuestionRenderer from "./QuestionRenderer";
import { validateQuestionLimits, canAddQuestionType } from "../utils/questionValidation";
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

/**
 * Creates a default question object with specified type
 * @param {string} type - Question type (text, multiple-choice, etc.)
 * @returns {Object} Default question configuration
 */
const DEFAULT_QUESTION = type => ({
  type,
  title: "",
  questionText: "",
  description: "",
  options: ["", ""],
  showInTable: true,
  required: false,
});

/**
 * Internal draggable question wrapper component
 * Provides drag and drop functionality for questions within the form builder
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Unique identifier for the draggable item
 * @param {React.ReactNode} props.children - Question content to be rendered
 * @returns {JSX.Element} Draggable wrapper with visual feedback
 */
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

/**
 * TemplateForm - Main component for creating and editing form templates
 * 
 * Features:
 * - Drag & drop question reordering
 * - Multiple question types support
 * - Tag management with creation
 * - User permissions and visibility settings
 * - Preview mode for testing forms
 * - Comprehensive validation
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Callback function when form is submitted
 * @param {Object} props.initialData - Initial data for editing existing templates
 * @param {boolean} props.isEditing - Whether component is in editing mode
 * @returns {JSX.Element} Complete template form with all features
 */
export default function TemplateForm({ onSubmit, initialData = null, isEditing = false }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [topic, setTopic] = useState(initialData?.topic || "");
  const [questions, setQuestions] = useState(initialData?.questions || []);
  const [showMenu, setShowMenu] = useState(false);
  const [lastDroppedIdx, setLastDroppedIdx] = useState(null);
  const [tags, setTags] = useState(initialData?.tags?.map(tag => ({ label: tag.name || tag, value: tag.name || tag })) || []);
  const [allowedUsers, setAllowedUsers] = useState(initialData?.allowedUsers?.map(user => ({ 
    label: `${user.username} (${user.email})`, 
    value: user.id, 
    email: user.email, 
    username: user.username 
  })) || []);
  const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? true);
  const [previewMode, setPreviewMode] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  // Update state when initialData changes (for editing mode)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setTopic(initialData.topic || "");
      setQuestions(initialData.questions || []);
      setTags(initialData.tags?.map(tag => ({ label: tag.name || tag, value: tag.name || tag })) || []);
      setAllowedUsers(initialData.allowedUsers?.map(user => ({ 
        label: `${user.username} (${user.email})`, 
        value: user.id, 
        email: user.email, 
        username: user.username 
      })) || []);
      setIsPublic(initialData.isPublic ?? true);
    }
  }, [initialData]);

  const handleAddQuestion = type => {
    // Check if we can add this question type
    if (!canAddQuestionType(questions, type)) {
      const configs = validateQuestionLimits([...questions, DEFAULT_QUESTION(type)]);
      if (!configs.isValid) {
        toast.error(configs.errors[0]);
        return;
      }
    }
    
    setQuestions(qs => [...qs, DEFAULT_QUESTION(type)]);
    toast.success(`✅ ${type} question added!`);
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
  const handleSubmit = async e => {
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
    const validation = validateQuestionLimits(questions);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit({
          title,
          description,
          topic,
          questions,
          tags: tags.map(t => t.value),
          accessUsers: allowedUsers.map(u => u.value),
          isPublic
        });
        
        // Show success message
        toast.success(isEditing ? "🎉 Template updated successfully!" : "🎉 Template created successfully!", {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '600',
            padding: '16px 24px',
            borderRadius: '12px',
          },
        });
        
        // Clear form only if creating (not editing)
        if (!isEditing) {
          setTitle("");
          setDescription("");
          setTopic("");
          setQuestions([]);
          setTags([]);
          setAllowedUsers([]);
          setIsPublic(true);
        }
      }
    } catch (error) {
      toast.error("Failed to create template. Please try again.");
      console.error("Template creation error:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-violet-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold">{isEditing ? "Edit Template" : "Create New Template"}</h2>
                <p className="text-violet-100 mt-1">{isEditing ? "Update your template with new questions and settings" : "Build engaging forms with questions and interactive elements"}</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Template Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter a compelling title"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-200"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Topic *
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-200"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="Education">📚 Education</option>
                    <option value="Quiz">🧩 Quiz</option>
                    <option value="Other">🔧 Other</option>
                  </select>
                </div>
              </div>

              <div>
                <MarkdownEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Describe what this template is for... (Markdown supported)"
                  rows={4}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                Tags & Organization
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tags (helps others find your template)
                </label>
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
                    const res = await fetch(`${API_URL}/api/tags`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name: newTag })
                    });
                    if (res.ok) {
                      setTags([...tags, { label: newTag, value: newTag }]);
                      toast.success(`Tag "${newTag}" created!`);
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
            </div>

            {/* Visibility */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                Access Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Template Visibility
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <input
                        type="radio"
                        name="visibility"
                        checked={isPublic}
                        onChange={() => {
                          setIsPublic(true);
                          setAllowedUsers([]);
                        }}
                        className="mr-3 text-violet-600 focus:ring-violet-500"
                      />
                      <div>
                        <span className="font-medium text-gray-800 dark:text-gray-200">🌍 Public</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Anyone can access this template</p>
                      </div>
                    </label>
                    <label className="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <input
                        type="radio"
                        name="visibility"
                        checked={!isPublic}
                        onChange={() => setIsPublic(false)}
                        className="mr-3 text-violet-600 focus:ring-violet-500"
                      />
                      <div>
                        <span className="font-medium text-gray-800 dark:text-gray-200">🔒 Private</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Only selected users can access</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Allowed Users {!isPublic && <span className="text-red-500">*</span>}
                  </label>
                  <AsyncSelect
                    isMulti
                    cacheOptions
                    loadOptions={fetchUserOptions}
                    defaultOptions={false}
                    value={allowedUsers}
                    onChange={setAllowedUsers}
                    placeholder={isPublic ? "Not needed for public templates" : "Type name or email to add users..."}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    noOptionsMessage={() => "No users found"}
                    isDisabled={isPublic}
                  />
                  {isPublic && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      This template will be publicly accessible to all users
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Questions</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Add questions to collect information from users ({questions.length} question{questions.length !== 1 ? 's' : ''} added)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {questions.length > 0 && (
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => setPreviewMode(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          !previewMode 
                            ? "bg-white dark:bg-gray-600 text-violet-600 dark:text-violet-400 shadow-sm" 
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          previewMode 
                            ? "bg-white dark:bg-gray-600 text-violet-600 dark:text-violet-400 shadow-sm" 
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        }`}
                      >
                        Preview
                      </button>
                    </div>
                  )}
                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                      onClick={() => setShowMenu(m => !m)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Question
                    </button>
                    {showMenu && (
                      <QuestionTypeMenu
                        onSelect={handleAddQuestion}
                        onClose={() => setShowMenu(false)}
                        questions={questions}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {questions.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <div className="mx-auto w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No questions yet</h4>
                    <p className="text-gray-500 dark:text-gray-500 mb-4">Start building your form by adding questions above</p>
                    <button
                      type="button"
                      onClick={() => setShowMenu(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add your first question
                    </button>
                  </div>
                ) : previewMode ? (
                  /* Preview Mode */
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-800 dark:text-blue-200">Preview Mode</h4>
                          <p className="text-sm text-blue-600 dark:text-blue-300">This is how your questions will appear to users</p>
                        </div>
                      </div>
                    </div>
                    
                    {questions.map((question, idx) => (
                      <QuestionRenderer
                        key={idx}
                        question={question}
                        mode="preview"
                      />
                    ))}
                  </div>
                ) : (
                  /* Edit Mode */
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                      items={questions.map((_, i) => i.toString())}
                      strategy={verticalListSortingStrategy}
                    >
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
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={questions.length === 0}
              >
                {questions.length === 0 ? (
                  "Add at least one question to create template"
                ) : isEditing ? (
                  `Update Template with ${questions.length} Question${questions.length !== 1 ? 's' : ''}`
                ) : (
                  `Create Template with ${questions.length} Question${questions.length !== 1 ? 's' : ''}`
                )}
              </button>
              {questions.length > 0 && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                  {isEditing ? "Your changes will be saved and the template updated" : "Your template will be saved and ready for others to use"}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}