import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import TemplateForm from "../components/TemplateForm";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateTemplate() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTemplate = async (templateData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
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
      console.log("Template created:", templateResult);
      
      // Show success message and redirect
      toast.success("🎉 Template created successfully!", {
        duration: 4000,
        style: {
          background: '#10B981',
          color: '#ffffff',
          fontWeight: '600',
          padding: '16px 24px',
          borderRadius: '12px',
        },
      });

      // Navigate to the forms dashboard
      setTimeout(() => {
        navigate("/forms");
      }, 1500);

    } catch (error) {
      console.error("Template creation error:", error);
      toast.error(error.message || "Failed to create template. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <TemplateForm 
        onSubmit={handleCreateTemplate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
