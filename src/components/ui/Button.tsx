"use client";
import React from "react";

export const Button = ({ children, className = "", variant = "primary", ...props }: any) => {
  const baseStyles = "px-8 py-3 rounded-lg font-medium transition-all duration-200";
  const variants: any = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white",
    secondary: "bg-[#16161c] border border-white/10 hover:bg-white/10 text-white",
  };
  return (
    <button {...props} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};
