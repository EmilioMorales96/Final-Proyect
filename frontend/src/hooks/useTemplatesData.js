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
        console.log("Fetched templates:", data);
        setTemplates(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching templates:", err);
        setTemplates([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Puedes loguear aquí para ver el estado de templates
  console.log("Templates in hook:", templates);

  return { templates, loading, fetchTemplates };
}
