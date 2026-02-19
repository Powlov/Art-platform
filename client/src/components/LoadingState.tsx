import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Загрузка...', 
  fullScreen = false,
  className 
}) => {
  const containerClass = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center py-12';

  return (
    <div className={cn(containerClass, className)} role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        {message && (
          <p className="text-sm text-muted-foreground font-medium" aria-label={message}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
      aria-hidden="true"
    />
  );
};

// Skeleton presets for common UI patterns
export const SkeletonCard: React.FC = () => (
  <div className="border rounded-lg p-6 space-y-4">
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex gap-2">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
    <Skeleton className="h-64 w-full rounded-lg" />
  </div>
);
