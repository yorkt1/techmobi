import React from "react";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse rounded-sm bg-muted ${className}`}
      {...props}
    />
  );
}

export { Skeleton };
