/**
 * Utility functions for question type validation and limits
 */

/**
 * Validates question type limits according to project requirements
 * @param {Array} questions - Array of questions to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateQuestionLimits(questions) {
  const typeCounts = {};
  questions.forEach(q => {
    typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
  });

  const limitedTypes = ['text', 'textarea', 'integer', 'checkbox'];
  const maxPerType = 4;
  const errors = [];

  for (const type of limitedTypes) {
    if (typeCounts[type] > maxPerType) {
      errors.push(`Maximum ${maxPerType} questions allowed for type: ${type} (currently ${typeCounts[type]})`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    typeCounts
  };
}

/**
 * Gets question type configuration with limits and metadata
 * @returns {Array} Array of question type configurations
 */
export function getQuestionTypeConfigs() {
  return [
    { 
      type: 'text', 
      label: 'Single-line Text', 
      icon: '📝', 
      limit: 4,
      color: 'blue',
      description: 'Short text input field'
    },
    { 
      type: 'textarea', 
      label: 'Multi-line Text', 
      icon: '📄', 
      limit: 4,
      color: 'green',
      description: 'Long text input area'
    },
    { 
      type: 'integer', 
      label: 'Number', 
      icon: '🔢', 
      limit: 4,
      color: 'purple',
      description: 'Numeric input field'
    },
    { 
      type: 'checkbox', 
      label: 'Checkbox', 
      icon: '☑️', 
      limit: 4,
      color: 'orange',
      description: 'Multiple choice selection'
    },
    { 
      type: 'radio', 
      label: 'Radio Button', 
      icon: '🔘', 
      limit: null,
      color: 'teal',
      description: 'Single choice selection'
    },
    { 
      type: 'select', 
      label: 'Dropdown', 
      icon: '📋', 
      limit: null,
      color: 'indigo',
      description: 'Dropdown selection'
    },
    { 
      type: 'linear', 
      label: 'Linear Scale', 
      icon: '📊', 
      limit: null,
      color: 'pink',
      description: 'Linear scale rating'
    },
    { 
      type: 'rating', 
      label: 'Star Rating', 
      icon: '⭐', 
      limit: null,
      color: 'yellow',
      description: 'Star-based rating'
    },
    { 
      type: 'grid_radio', 
      label: 'Grid (Radio)', 
      icon: '🎯', 
      limit: null,
      color: 'red',
      description: 'Grid with radio buttons'
    },
    { 
      type: 'grid_checkbox', 
      label: 'Grid (Checkbox)', 
      icon: '📊', 
      limit: null,
      color: 'cyan',
      description: 'Grid with checkboxes'
    },
    { 
      type: 'file', 
      label: 'File Upload', 
      icon: '📎', 
      limit: null,
      color: 'gray',
      description: 'File upload field'
    }
  ];
}

/**
 * Checks if a question type can be added based on current counts
 * @param {Array} questions - Current questions array
 * @param {string} questionType - Type to check
 * @returns {boolean} Whether the type can be added
 */
export function canAddQuestionType(questions, questionType) {
  const configs = getQuestionTypeConfigs();
  const config = configs.find(c => c.type === questionType);
  
  if (!config || !config.limit) {
    return true; // Unlimited types can always be added
  }
  
  const currentCount = questions.filter(q => q.type === questionType).length;
  return currentCount < config.limit;
}
