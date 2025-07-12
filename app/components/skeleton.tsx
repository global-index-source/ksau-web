"use client";

import React from 'react';

interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
  width?: string;
}

export function Skeleton({ 
  className = '', 
  lines = 1, 
  height = 'h-4', 
  width = 'w-full' 
}: SkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton rounded ${height} ${width} ${
            i === lines - 1 && lines > 1 ? 'w-3/4' : ''
          }`}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="border border-green-900 bg-black/50 backdrop-blur rounded-lg p-6 space-y-4">
      <Skeleton height="h-6" width="w-1/2" />
      <Skeleton lines={3} />
      <div className="flex gap-2">
        <Skeleton height="h-10" width="w-24" />
        <Skeleton height="h-10" width="w-24" />
      </div>
    </div>
  );
}

export function SystemInfoSkeleton() {
  return (
    <div className="pt-4 border-t border-green-900 space-y-3">
      <Skeleton height="h-4" width="w-32" />
      <div className="space-y-2">
        <Skeleton height="h-3" width="w-full" />
        <Skeleton height="h-3" width="w-5/6" />
        <Skeleton height="h-3" width="w-4/5" />
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 'w-5 h-5' }: { size?: string }) {
  return (
    <div className={`loading-spinner ${size}`} />
  );
}