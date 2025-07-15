import { useCallback } from "react";
import { toast } from "react-toastify";
import { confirmDelete } from '../utils/confirmDialog';

/**
 * Custom hook for form-related actions (create, delete)
 * Provides reusable functions for form operations with error handling and notifications
 * 
 * @param {string} userToken - Authentication token for API requests
 * @param {Function} fetchForms - Function to refresh forms list after operations
 * @returns {Object} Object containing form action functions:
 *   - handleCreateForm: Function to create/submit a new form
 *   - handleDeleteForm: Function to delete a form with confirmation
 */
export const useFormActions = (userToken, fetchForms) => {
  /**
   * Handles form creation/submission
   * @param {Object} formData - Form data to submit
   * @returns {Promise<Object>} Result object with success status and optional error
   */
  const handleCreateForm = useCallback(async (formData) => {
    if (!userToken) {
      toast.error("Authentication required");
      return { success: false };
    }

    // Ensure answers is always an array
    const safeFormData = {
      ...formData,
      answers: Array.isArray(formData.answers) ? formData.answers : [],
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/forms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(safeFormData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      toast.success("Form submitted successfully!");
      return { success: true };
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.message || "Submission failed");
      return { success: false, error };
    }
  }, [userToken]);

  /**
   * Handles form deletion with user confirmation
   * @param {string} formId - ID of the form to delete
   * @returns {Promise<boolean>} Success status of deletion
   */
  const handleDeleteForm = useCallback(async (formId) => {
    const confirmed = await confirmDelete("Are you sure you want to delete this form?");
    if (!confirmed) return false;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/forms/${formId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${userToken}` }
      });

      if (!res.ok) throw new Error("Deletion failed");

      toast.success("Form deleted!");
      fetchForms();
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Deletion failed");
      return false;
    }
  }, [userToken, fetchForms]);

  return { handleCreateForm, handleDeleteForm };
};