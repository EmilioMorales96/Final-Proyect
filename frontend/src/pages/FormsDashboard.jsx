import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiClipboard, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useTemplatesData } from "../hooks/useTemplatesData.js";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Modal } from "../components/Modal";

export default function FormsDashboard() {
  const { token, user } = useAuth();
  const { templates, loading, fetchTemplates } = useTemplatesData(token);
  const [modalOpen, setModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Open the modal and store the template id to delete
  const openDeleteModal = (id) => {
    setTemplateToDelete(id);
    setModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false);
    setTemplateToDelete(null);
  };

  // Delete the selected template
  const handleDelete = async () => {
    if (!templateToDelete) return;
    try {
      const res = await fetch(`/api/templates/${templateToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error();
      toast.success("Template deleted");
      fetchTemplates();
    } catch {
      toast.error("Failed to delete template");
    } finally {
      closeModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            My Forms
          </h1>
          {user && (
            <Link
              to="/forms/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-800 text-white font-semibold shadow hover:from-purple-800 hover:to-indigo-900 transition-all text-lg"
            >
              <FiPlus className="text-xl" />
              Create form
            </Link>
          )}
        </div>

        {/* Forms gallery */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Recent forms
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-52 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : templates.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 text-center py-16">
              You don't have any templates yet. Create a new one!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col h-full p-0 overflow-hidden"
                >
                  <div className="flex-1 flex flex-col gap-2 p-6 pb-4">
                    <h3 className="font-bold text-2xl text-purple-700 dark:text-purple-400 mb-1 truncate">
                      {template.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-200 text-base mb-1 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Updated:{" "}
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2 min-w-0">
                    {user ? (
                      <>
                        <Link
                          to={`/forms/${template.id}/edit`}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition w-full sm:w-auto"
                          title="Edit"
                        >
                          <FiEdit2 />
                          Edit
                        </Link>
                        <Link
                          to={`/forms/${template.id}/fill`}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition w-full sm:w-auto"
                          title="Fill"
                        >
                          <FiClipboard />
                          Fill
                        </Link>
                        <Link
                          to={`/forms/${template.id}/answers`}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition w-full sm:w-auto"
                          title="View answers"
                        >
                          <FiClipboard />
                          View answers
                        </Link>
                        <button
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition w-full sm:w-auto"
                          title="Delete"
                          onClick={() => openDeleteModal(template.id)}
                        >
                          <FiTrash2 />
                          Delete
                        </button>
                      </>
                    ) : (
                      <div className="text-center text-gray-400 text-sm py-2">
                        Log in to edit, fill, or delete forms.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Modal open={modalOpen} title="Delete template" onClose={closeModal}>
        <p className="mb-6 text-gray-700 dark:text-gray-200">
          Are you sure you want to delete this template? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}