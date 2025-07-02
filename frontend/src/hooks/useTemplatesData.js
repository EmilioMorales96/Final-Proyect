import { useCallback, useState } from "react";

/**
 * Custom hook to fetch and manage template data from the API.
 * @param {string} token - The user's authentication token.
 * @returns {object} - { templates, loading, fetchTemplates }
 */
export function useTemplatesData(token) {
  // State for the list of templates
  const [templates, setTemplates] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(true);

  /**
   * Fetch templates from the API and update state.
   */
  const fetchTemplates = useCallback(() => {
    setLoading(true);
    fetch("/api/templates", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setTemplates(data))
      .finally(() => setLoading(false));
  }, [token]);

  return { templates, loading, fetchTemplates };
}