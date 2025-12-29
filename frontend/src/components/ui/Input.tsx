import React from 'react';
export interface InputProps {
  children?: React.ReactNode;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ children, className }) => {
