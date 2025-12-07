import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'text' }) => {
  const baseClasses = 'animate-pulse bg-gray-300 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'h-4 rounded',
    card: 'h-32 rounded-lg',
    circular: 'rounded-full',
  };
  
  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />;
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
};
