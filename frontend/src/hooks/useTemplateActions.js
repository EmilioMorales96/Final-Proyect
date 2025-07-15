import { useCallback } from "react";
import { toast } from "react-toastify";
import { confirmDelete } from '../utils/confirmDialog';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook for template-related actions (create, update, delete)
 * Provides reusable functions for template operations with validation and error handling
 * 
 * @param {string} userToken - Authentication token for API requests
 * @param {Function} fetchTemplates - Function to refresh templates list after operations
 * @returns {Object} Object containing template action functions:
 *   - handleCreateTemplate: Function to create a new template
 *   - handleUpdateTemplate: Function to update an existing template
 *   - handleDeleteTemplate: Function to delete a template with confirmation
 */
export const useTemplateActions = (userToken, fetchTemplates) => {
  /**
   * Handles template creation with validation
   * @param {Object} templateData - Template data to create
   * @returns {Promise<Object>} Result object with success status and optional data
   */
  const handleCreateTemplate = useCallback(async (templateData) => {
    // Frontend validation before sending to backend
    if (!Array.isArray(templateData.questions) || templateData.questions.length === 0) {
      toast.error("You must add at least one question.");
      return { success: false };
    }
    
    if (templateData.questions.some(q => !q.title || !q.questionText)) {
      toast.error("Each question must have a title and question text.");
      return { success: false };
    }

    try {
      const res = await fetch(`${API_URL}/api/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(templateData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error creating template.");

      toast.success("Template created!");
      return { success: true, data };
    } catch (error) {
      console.error("Template creation error:", error);
      toast.error(error.message || "Error creating template.");
      return { success: false };
    }
  }, [userToken]);

  /**
   * Handles template updates
   * @param {string} templateId - ID of the template to update
   * @param {Object} templateData - Updated template data
   * @returns {Promise<Object>} Result object with success status and optional data
   */
  const handleUpdateTemplate = useCallback(async (templateId, templateData) => {
    try {
      const res = await fetch(`${API_URL}/api/templates/${templateId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(templateData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Template updated!");
      return { success: true, data };
    } catch (error) {
      console.error("Template update error:", error);
      toast.error(error.message || "Update failed");
      return { success: false };
    }
  }, [userToken]);

  /**
   * Handles template deletion with user confirmation
   * @param {string} templateId - ID of the template to delete
   * @returns {Promise<boolean>} Success status of deletion
   */
  const handleDeleteTemplate = useCallback(async (templateId) => {
    const confirmed = await confirmDelete("Are you sure you want to delete this template?");
    if (!confirmed) return false;

    try {
      const res = await fetch(`${API_URL}/api/templates/${templateId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${userToken}` }
      });

      if (!res.ok) throw new Error("Deletion failed");

      toast.success("Template deleted!");
      fetchTemplates();
      return true;
    } catch (error) {
      console.error("Template deletion error:", error);
      toast.error(error.message || "Deletion failed");
      return false;
    }
  }, [userToken, fetchTemplates]);

  return { handleCreateTemplate, handleUpdateTemplate, handleDeleteTemplate };
};
