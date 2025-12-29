import React from 'react';
export interface PopoverProps {
  children?: React.ReactNode;
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
