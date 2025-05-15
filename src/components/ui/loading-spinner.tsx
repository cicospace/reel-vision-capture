
import React from "react";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingSpinner = ({ className = "", size = "md" }: LoadingSpinnerProps) => {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={`animate-spin border-4 border-primary border-t-transparent rounded-full ${sizeClass[size]} ${className}`}></div>
  );
};

export default LoadingSpinner;
