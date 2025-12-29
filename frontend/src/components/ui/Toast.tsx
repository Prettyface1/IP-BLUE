import React from 'react';
export interface ToastProps {
  children?: React.ReactNode;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
