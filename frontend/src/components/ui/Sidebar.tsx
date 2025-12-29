import React from 'react';
export interface SidebarProps {
  children?: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
