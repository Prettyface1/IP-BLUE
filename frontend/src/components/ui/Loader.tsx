import React from 'react';
export interface LoaderProps {
  children?: React.ReactNode;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
