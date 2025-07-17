import React from 'react';

/**
 * HelpCard - Componente reutilizable para tarjetas de ayuda con dark mode
 * Mejora la consistencia visual en secciones de ayuda
 */
const HelpCard = ({ 
  title, 
  description, 
  icon: Icon, 
  iconColor = 'blue',
  children,
  buttonText,
  onButtonClick,
  className = '',
  ...props 
}) => {
  const iconColors = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
  };

  const buttonColors = {
    blue: 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300',
    yellow: 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300',
    green: 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300',
    purple: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white px-4 py-2 rounded-md shadow-sm hover:shadow-md',
    red: 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300'
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow ${className}`} {...props}>
      <div className="flex items-center mb-4">
        {Icon && (
          <div className={`p-2 rounded-lg mr-3 ${iconColors[iconColor]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      
      {children}
      
      {buttonText && onButtonClick && (
        <button 
          onClick={onButtonClick}
          className={`text-sm font-medium transition-colors ${buttonColors[iconColor]}`}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default HelpCard;
