import React from 'react';
export interface TabsProps {
  children?: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
