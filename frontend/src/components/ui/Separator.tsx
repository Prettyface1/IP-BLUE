import React from 'react';
export interface SeparatorProps {
  children?: React.ReactNode;
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
