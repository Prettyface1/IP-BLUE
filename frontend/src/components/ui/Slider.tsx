import React from 'react';
export interface SliderProps {
  children?: React.ReactNode;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
