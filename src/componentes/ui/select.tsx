import React from "react";

export const Select = ({ value, onValueChange, children }) => {
  const handleChange = (e) => onValueChange(e.target.value);
  return (
    <div className="relative">
      <select 
        value={value} 
        onChange={handleChange}
        className="flex h-9 w-full items-center justify-between rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
      >
        {children}
      </select>
    </div>
  );
};

export const SelectTrigger = ({ children, className }) => <div className={className}>{children}</div>;
export const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;
export const SelectContent = ({ children }) => <>{children}</>;
export const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;
