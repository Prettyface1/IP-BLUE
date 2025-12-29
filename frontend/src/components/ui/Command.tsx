import React from 'react';
export interface CommandProps {
  children?: React.ReactNode;
  className?: string;
}

export const Command: React.FC<CommandProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
