import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import TemplateForm from "../components/TemplateForm";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateTemplate() {
  const { token } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTemplate = async (templateData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Creating template with data:", templateData);
      
      const response = await fetch(`${API_URL}/api/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create template");
      }

      const templateResult = await response.json();
      console.log("✅ Template created successfully:", templateResult);
      
      // Navigate to the forms dashboard
      setTimeout(() => {
        navigate("/forms");
      }, 2000);

    } catch (error) {
      console.error("❌ Template creation error:", error);
      toast.error(error.message || t('msg.create_template_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TemplateForm 
      onSubmit={handleCreateTemplate}
      isSubmitting={isSubmitting}
    />
  );
}
