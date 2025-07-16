import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TemplateForm from "../components/TemplateForm";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

export default function TemplateEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { t } = useTranslation();
  const [templateData, setTemplateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load template data on mount
  useEffect(() => {
    if (!id) {
      setError(t('editor.templateIdRequired'));
      setLoading(false);
      return;
    }

    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/templates/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(t('editor.templateNotFound'));
          } else if (response.status === 403) {
            throw new Error(t('editor.noPermission'));
          } else {
            throw new Error(t('editor.failedToLoad'));
          }
        }

        const data = await response.json();
        console.log("Loaded template data:", data);
        setTemplateData(data);
      } catch (error) {
        console.error("Error loading template:", error);
        setError(error.message);
        toast.error(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id, token, t]);

  // Handle template update
  const handleSubmit = async (formData) => {
    try {
      console.log("Updating template with data:", formData);
      
      const response = await fetch(`${API_URL}/api/templates/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          topic: formData.topic,
          questions: formData.questions,
          tags: formData.tags,
          isPublic: formData.isPublic,
          accessUsers: formData.accessUsers,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update template");
      }

      const updatedTemplate = await response.json();
      console.log("Template updated:", updatedTemplate);
      
      // Navigate back to forms dashboard after successful update
      setTimeout(() => {
        navigate("/forms");
      }, 2000);
      
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error(`Failed to update template: ${error.message}`);
      throw error; // Re-throw to be handled by TemplateForm
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Loading Template</h2>
          <p className="text-gray-500 dark:text-gray-400">Please wait while we fetch the template data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-violet-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Error Loading Template</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/forms")}
              className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Back to Templates
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TemplateForm 
      onSubmit={handleSubmit} 
      initialData={templateData} 
      isEditing={true}
    />
  );
}