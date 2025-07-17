import React from 'react';

/**
 * FormCheckbox - Componente reutilizable para checkboxes con dark mode
 * Mejora la consistencia visual y accesibilidad
 */
const FormCheckbox = ({ 
  label, 
  description,
  checked, 
  onChange, 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <label className={`flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm focus:border-blue-300 dark:focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 focus:ring-opacity-50 transition-colors"
        {...props}
      />
      <span className="ml-3 text-sm">
        <span className="font-medium text-gray-900 dark:text-gray-100">{label}</span>
        {description && (
          <span className="text-gray-500 dark:text-gray-400 block">{description}</span>
        )}
      </span>
    </label>
  );
};

export default FormCheckbox;
