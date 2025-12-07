import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  onMouseEnter,
  onMouseLeave,
  hoverable = false,
}) => {
  const hoverClasses = hoverable
    ? 'hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 cursor-pointer transition-all duration-200'
    : '';
  
  return (
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm ${hoverClasses} ${className}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};
