const CustomLoader = ({ size = 'small' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-10 h-10'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} rounded-full border-2 border-t-orange-500 border-r-orange-500 border-b-orange-200 border-l-orange-200 animate-spin`}
      ></div>
    </div>
  );
};

export default CustomLoader;