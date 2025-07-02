import { motion as Motion } from 'framer-motion';

export const SectionContainer = ({ children, darkMode, title }) => (
  <Motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-xl p-8 mb-8 shadow-sm border ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}
  >
    <h3 className={`text-xl font-medium mb-6 ${
      darkMode ? 'text-gray-100' : 'text-gray-800'
    }`}>
      {title}
    </h3>
    {children}
  </Motion.section>
);