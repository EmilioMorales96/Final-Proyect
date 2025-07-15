import { useState, useCallback } from "react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook for fetching and managing forms and templates data
 * Provides state management and fetch functions for forms and templates
 * 
 * @param {string} userToken - Authentication token for API requests
 * @returns {Object} Object containing:
 *   - forms: Array of user forms
 *   - templates: Array of available templates
 *   - loading: Loading state boolean
 *   - error: Error message or null
 *   - fetchForms: Function to fetch forms data
 *   - fetchTemplates: Function to fetch templates data
 */
export const useFormsData = (userToken) => {
  const [forms, setForms] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches user forms from the API
   */
  const fetchForms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/forms`, {
        headers: { "Authorization": `Bearer ${userToken}` }
      });
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setForms(data);
      } else {
        setForms([]);
        console.warn("[useFormsData] Expected forms array, received:", typeof data);
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load forms");
      console.error("Error fetching forms:", err);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  /**
   * Fetches available templates from the API
   */
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/templates`, {
        headers: {
          "Authorization": `Bearer ${userToken}`
        }
      });
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setTemplates(data);
      } else {
        setTemplates([]);
        console.warn("[useFormsData] Expected templates array, received:", typeof data);
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load templates");
      console.error("Error fetching templates:", err);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  return { forms, templates, loading, error, fetchForms, fetchTemplates };
};