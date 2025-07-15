import { useCallback, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook for fetching templates data
 * Note: Consider consolidating with useFormsData for consistency
 * 
 * @param {string} token - Authentication token for API requests
 * @returns {Object} Object containing:
 *   - templates: Array of templates
 *   - loading: Loading state boolean
 *   - fetchTemplates: Function to fetch templates data
 */
export function useTemplatesData(token) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches templates from the API
   */
  const fetchTemplates = useCallback(() => {
    setLoading(true);
    fetch(`${API_URL}/api/templates`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTemplates(data);
        } else {
          console.warn("API returned non-array data for templates:", typeof data);
          setTemplates([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching templates:", err);
        setTemplates([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return { templates, loading, fetchTemplates };
}
