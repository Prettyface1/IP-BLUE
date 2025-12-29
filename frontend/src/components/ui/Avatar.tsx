import React from 'react';
export interface AvatarProps {
  children?: React.ReactNode;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
