import PropTypes from 'prop-types';

const Loader = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4'
  };

  const colorClasses = {
    primary: 'border-t-blue-500 border-r-blue-500 border-b-blue-500 border-l-transparent',
    white: 'border-t-white border-r-white border-b-white border-l-transparent',
    gray: 'border-t-gray-400 border-r-gray-400 border-b-gray-400 border-l-transparent'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'white', 'gray'])
};

export default Loader;