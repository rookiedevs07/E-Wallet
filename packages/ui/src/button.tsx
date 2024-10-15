"use client";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void; // onClick prop that takes a function
}

export const Button = ({ children, className, onClick }: ButtonProps) => {
  return (
    <button
      className={className}
      onClick={onClick} // Bind the onClick function to the button
    >
      {children}
    </button>
  );
};
