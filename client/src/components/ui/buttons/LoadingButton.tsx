"use client";

import React from "react";
import { Spinner } from "@/components/ui/spinners";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText = "Processing...",
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      disabled={isLoading || props.disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        className
      }`}
      style={{
        backgroundColor: isLoading
          ? "rgb(var(--primary-dark))"
          : "rgb(var(--primary))",
        color: "rgb(var(--text))",
        opacity: isLoading ? 0.8 : 1,
      }}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {isLoading ? loadingText : children}
    </button>
  );
};