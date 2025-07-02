import PropTypes from 'prop-types';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  icon,
  ...props
}) => {
  const baseClasses = "px-6 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-2 text-sm";
  
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white shadow-sm",
    secondary: "bg-green-500 hover:bg-green-600 text-white shadow-sm",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
    outline: "border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
  };

  const disabledClasses = disabled ? "opacity-70 cursor-not-allowed bg-gray-200 dark:bg-gray-600" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'outline', 'ghost']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.node
};

export default Button;