import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef } from "react";

/**
 * Reusable Modal component with animation and accessibility features
 * Supports ESC key and backdrop click to close
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether modal is open
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {Function} props.onClose - Function to close modal
 * @param {string} props.size - Modal size: 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full'
 * @returns {JSX.Element} Animated modal component
 */
export function Modal({ open, title, children, onClose, size = 'sm' }) {
  const backdropRef = useRef();

  // Size mapping for modal widths
  const sizeClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md', 
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    'full': 'max-w-full'
  };

  // Close with ESC key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Close when clicking outside modal
  const handleBackdrop = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={backdropRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleBackdrop}
          aria-modal="true"
          role="dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl ${sizeClasses[size] || sizeClasses.sm} w-full max-h-[90vh] overflow-y-auto relative`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <button
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold bg-white dark:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            {title && <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100 px-6 pt-6">{title}</h2>}
            <div className={title ? "" : "pt-12"}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}