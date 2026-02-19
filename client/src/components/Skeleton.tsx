import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular', 
  width, 
  height,
  count = 1 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

export function ArtworkCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      <Skeleton variant="rectangular" height={300} />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" height={24} width="80%" />
        <Skeleton variant="text" height={16} width="60%" />
        <Skeleton variant="text" height={16} width="40%" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton variant="text" height={32} width={100} />
          <Skeleton variant="rectangular" height={40} width={80} />
        </div>
      </div>
    </div>
  );
}

export function ArtworkGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ArtworkCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <Skeleton variant="rectangular" width={48} height={48} />
        <Skeleton variant="text" height={20} width={60} />
      </div>
      <Skeleton variant="text" height={16} width="40%" className="mb-1" />
      <Skeleton variant="text" height={36} width="60%" />
    </div>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <Skeleton variant="rectangular" height={192} />
      <div className="px-8 pb-8">
        <div className="flex items-start gap-6 -mt-20">
          <Skeleton variant="circular" width={160} height={160} />
          <div className="flex-1 mt-16 space-y-4">
            <Skeleton variant="text" height={36} width="40%" />
            <Skeleton variant="text" height={20} width="60%" />
            <Skeleton variant="text" height={16} width="80%" count={2} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" height={20} className="flex-1" />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton variant="text" height={24} width={200} />
          <Skeleton variant="text" height={16} width={150} />
        </div>
        <Skeleton variant="rectangular" height={32} width={120} />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton variant="text" height={16} width={60} />
            <div className="flex-1">
              <Skeleton 
                variant="rectangular" 
                height={40} 
                width={`${Math.random() * 40 + 40}%`} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <Skeleton variant="rectangular" width={80} height={80} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height={20} width="70%" />
        <Skeleton variant="text" height={16} width="50%" />
        <Skeleton variant="text" height={16} width="40%" />
      </div>
      <Skeleton variant="rectangular" width={100} height={40} />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Skeleton variant="text" height={48} width="40%" />
          <Skeleton variant="text" height={20} width="60%" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Skeleton variant="text" height={32} width="30%" className="mb-6" />
          <TableSkeleton rows={8} />
        </div>
      </div>
    </div>
  );
}

// Shimmer effect for better loading animation
export function ShimmerSkeleton({ className = '', children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ transform: 'skewX(-20deg)' }}
      />
    </div>
  );
}
