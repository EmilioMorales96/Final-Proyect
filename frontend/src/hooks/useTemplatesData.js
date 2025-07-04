import { useCallback, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function useTemplatesData(token) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

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
          console.warn("API returned non-array data:", data);
          setTemplates([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching templates:", err);
        setTemplates([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Log para depuración
   console.log("Templates in hook:", templates);

  return { templates, loading, fetchTemplates };
}
