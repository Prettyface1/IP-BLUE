import React from 'react';
export interface ProgressProps {
  children?: React.ReactNode;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
