import { useMemo } from 'react';
import { getQuestionTypeConfigs } from '../utils/questionValidation';

/**
 * QuestionLimitsIndicator - Shows question type limits and current counts
 * Provides visual feedback about question type restrictions
 * 
 * @param {Object} props - Component props
 * @param {Array} props.questions - Current questions array
 * @param {Function} props.onTypeSelect - Called when user wants to add a question type
 * @returns {JSX.Element} Question limits indicator component
 */
export default function QuestionLimitsIndicator({ questions = [], onTypeSelect }) {
  // Question type limits and configurations
  const questionTypes = useMemo(() => {
    const configs = getQuestionTypeConfigs();

    // Count current questions by type
    const typeCounts = {};
    questions.forEach(q => {
      typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
    });

    return configs.map(config => ({
      ...config,
      current: typeCounts[config.type] || 0,
      canAdd: config.limit ? (typeCounts[config.type] || 0) < config.limit : true,
      isAtLimit: config.limit ? (typeCounts[config.type] || 0) >= config.limit : false
    }));
  }, [questions]);

  // Get color classes based on color name
  const getColorClasses = (color, isAtLimit, canAdd) => {
    const baseColors = {
      blue: 'border-blue-200 bg-blue-50 text-blue-700',
      green: 'border-green-200 bg-green-50 text-green-700',
      purple: 'border-purple-200 bg-purple-50 text-purple-700',
      orange: 'border-orange-200 bg-orange-50 text-orange-700',
      teal: 'border-teal-200 bg-teal-50 text-teal-700',
      indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700',
      pink: 'border-pink-200 bg-pink-50 text-pink-700',
      yellow: 'border-yellow-200 bg-yellow-50 text-yellow-700',
      red: 'border-red-200 bg-red-50 text-red-700',
      cyan: 'border-cyan-200 bg-cyan-50 text-cyan-700',
      gray: 'border-gray-200 bg-gray-50 text-gray-700'
    };

    const darkBaseColors = {
      blue: 'dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      green: 'dark:border-green-800 dark:bg-green-900/20 dark:text-green-300',
      purple: 'dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      orange: 'dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      teal: 'dark:border-teal-800 dark:bg-teal-900/20 dark:text-teal-300',
      indigo: 'dark:border-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
      pink: 'dark:border-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      yellow: 'dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      red: 'dark:border-red-800 dark:bg-red-900/20 dark:text-red-300',
      cyan: 'dark:border-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300',
      gray: 'dark:border-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    };

    if (isAtLimit) {
      return 'border-red-300 bg-red-100 text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300';
    }
    
    if (!canAdd) {
      return 'border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-700 dark:bg-gray-900/30 dark:text-gray-500';
    }

    return `${baseColors[color]} ${darkBaseColors[color]} hover:shadow-md transition-all duration-200`;
  };

  const limitedTypes = questionTypes.filter(type => type.limit);
  const unlimitedTypes = questionTypes.filter(type => !type.limit);

  return (
    <div className="space-y-6">
      {/* Limited Types */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
          📊 Limited Question Types (Max 4 each)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {limitedTypes.map((typeConfig) => (
            <button
              key={typeConfig.type}
              onClick={() => typeConfig.canAdd && onTypeSelect?.(typeConfig.type)}
              disabled={!typeConfig.canAdd}
              className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                getColorClasses(typeConfig.color, typeConfig.isAtLimit, typeConfig.canAdd)
              } ${
                typeConfig.canAdd 
                  ? 'cursor-pointer hover:scale-105 active:scale-95' 
                  : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{typeConfig.icon}</span>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    typeConfig.isAtLimit 
                      ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' 
                      : 'bg-white/60 dark:bg-gray-800/60'
                  }`}>
                    {typeConfig.current}/{typeConfig.limit}
                  </span>
                </div>
              </div>
              <div className="font-medium text-sm mb-1">{typeConfig.label}</div>
              {typeConfig.isAtLimit && (
                <div className="text-xs opacity-75">Limit reached</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Unlimited Types */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
          ♾️ Unlimited Question Types
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {unlimitedTypes.map((typeConfig) => (
            <button
              key={typeConfig.type}
              onClick={() => onTypeSelect?.(typeConfig.type)}
              className={`p-3 rounded-lg border-2 text-left cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 ${
                getColorClasses(typeConfig.color, false, true)
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{typeConfig.icon}</span>
                <div className="text-right">
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/60 dark:bg-gray-800/60">
                    {typeConfig.current}
                  </span>
                </div>
              </div>
              <div className="font-medium text-sm mb-1">{typeConfig.label}</div>
              <div className="text-xs opacity-75">No limit</div>
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="font-semibold text-gray-800 dark:text-gray-200">Total Questions</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click on any question type above to add it
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {questions.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">questions</div>
          </div>
        </div>
      </div>
    </div>
  );
}
