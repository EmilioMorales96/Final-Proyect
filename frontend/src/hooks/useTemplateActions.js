import { useCallback } from "react";
import { toast } from "react-toastify";
import { confirmDelete } from '../utils/confirmDialog';

const API_URL = import.meta.env.VITE_API_URL;

export const useTemplateActions = (userToken, fetchTemplates) => {
  const handleCreateTemplate = useCallback(async (templateData) => {
    console.log("[handleCreateTemplate] Trying to create template:", templateData);
    // Frontend validation before sending to backend
    if (!Array.isArray(templateData.questions) || templateData.questions.length === 0) {
      console.warn("[handleCreateTemplate] No valid questions:", templateData.questions);
      toast.error("You must add at least one question.");
      return { success: false };
    }
    if (templateData.questions.some(q => !q.title || !q.questionText)) {
      templateData.questions.forEach((q, i) => {
        if (!q.title || !q.questionText) {
          console.warn(`[handleCreateTemplate] Incomplete question #${i + 1}:`, q);
        }
      });
      toast.error("Each question must have a title and question text.");
      return { success: false };
    }

    try {
      console.log("[handleCreateTemplate] Sending to:", `${API_URL}/api/templates`);
      const res = await fetch(`${API_URL}/api/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(templateData)
      });

      const data = await res.json();
      console.log("[handleCreateTemplate] Response:", data);
      if (!res.ok) throw new Error(data.message || "Error creating template.");

      toast.success("Template created!");
      return { success: true, data };
    } catch (error) {
      console.error("[handleCreateTemplate] Create error:", error);
      toast.error(error.message || "Error creating template.");
      return { success: false };
    }
  }, [userToken]);

  const handleUpdateTemplate = useCallback(async (templateId, templateData) => {
    console.log("[handleUpdateTemplate] Trying to update template:", templateId, templateData);
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
      console.log("[handleUpdateTemplate] Response:", data);
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Template updated!");
      return { success: true, data };
    } catch (error) {
      console.error("[handleUpdateTemplate] Update error:", error);
      toast.error(error.message || "Update failed");
      return { success: false };
    }
  }, [userToken]);

  const handleDeleteTemplate = useCallback(async (templateId) => {
    const confirmed = await confirmDelete("Are you sure you want to delete this form?");
    if (!confirmed) return false;
    
    console.log("[handleDeleteTemplate] Trying to delete template:", templateId);

    try {
      const res = await fetch(`${API_URL}/api/templates/${templateId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${userToken}` }
      });

      console.log("[handleDeleteTemplate] Response status:", res.status);
      if (!res.ok) throw new Error("Deletion failed");

      toast.success("Template deleted!");
      fetchTemplates();
      return true;
    } catch (error) {
      console.error("[handleDeleteTemplate] Delete error:", error);
      toast.error(error.message || "Deletion failed");
      return false;
    }
  }, [userToken, fetchTemplates]);

  return { handleCreateTemplate, handleUpdateTemplate, handleDeleteTemplate };
};
