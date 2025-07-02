import { useState, useCallback } from "react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const useFormsData = (userToken) => {
  const [forms, setForms] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchForms = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching forms...");
      console.log("Token enviado en forms:", userToken);
      const response = await fetch(`${API_URL}/api/forms`, {
        headers: { "Authorization": `Bearer ${userToken}` }
      });
      console.log("Forms response status:", response.status);
      const data = await response.json();
      console.log("Forms response data:", data);
      if (Array.isArray(data)) {
        setForms(data);
      } else {
        setForms([]);
      console.warn("[useFormsData] forms is not an array:", data);
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load forms");
      console.error("Error fetching forms:", err);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching templates...");
      const response = await fetch(`${API_URL}/api/templates`, {
        headers: {
          "Authorization": `Bearer ${userToken}`
        }
      });
      console.log("Templates response status:", response.status);
      const data = await response.json();
      console.log("Templates response data:", data);
      if (Array.isArray(data)) {
        setTemplates(data);
      } else {
        setTemplates([]);
        console.warn("[useFormsData] templates is not an array:", data);
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