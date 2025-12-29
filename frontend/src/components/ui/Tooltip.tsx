import React from 'react';
export interface TooltipProps {
  children?: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, className }) => {
