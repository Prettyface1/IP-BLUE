import React from 'react';
export interface SkeletonProps {
  children?: React.ReactNode;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ children, className }) => {
