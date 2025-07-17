import React from 'react';

/**
 * FormCard - Componente reutilizable para tarjetas de formularios con dark mode
 * Mejora la consistencia visual y reduce código duplicado
 */
const FormCard = ({ 
  title, 
  subtitle, 
  children, 
  className = '',
  headerClassName = '',
  bodyClassName = '',
  ...props 
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`} {...props}>
      {(title || subtitle) && (
        <div className={`text-center mb-8 ${headerClassName}`}>
          {title && (
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default FormCard;
