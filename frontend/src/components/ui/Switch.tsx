import React from 'react';
export interface SwitchProps {
  children?: React.ReactNode;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
