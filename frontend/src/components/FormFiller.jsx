import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from './Button';

export default function FormFiller({ 
  formState,
  setFormState,
  templates,
  onSubmit
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Protection against non-array templates
  const safeTemplates = Array.isArray(templates) ? templates : [];
  if (!Array.isArray(templates)) {
    console.warn('[FormFiller] templates is not an array:', templates);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
      // Secures that answers is always an array
      answers: Array.isArray(prev.answers) ? prev.answers : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit presionado", formState, onSubmit);
    // Extra validation to ensure title and templateId are set
    if (!formState.title || !formState.templateId) {
      toast.error('The title and template are required.');
      return;
    }
    setLoading(true);
    try {
      // Secure that answers is always an array before sending
      const submitData = {
        ...formState,
        answers: Array.isArray(formState.answers) ? formState.answers : [],
      };
      await onSubmit(submitData);
      toast.success('Form submitted successfully!');
      navigate('/formularios');
    } catch (error) {
      toast.error(error.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Título del formulario
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formState.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Descripción
          </label>
          <input
            id="description"
            name="description"
            type="text"
            value={formState.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div>
          <label htmlFor="templateId" className="block text-sm font-medium mb-1">
            Select Template
          </label>
          <select
            id="templateId"
            name="templateId"
            value={formState.templateId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          >
            <option value="">-- Select a template --</option>
            {safeTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Form'}
        </Button>
      </div>
    </form>
  );
}