import React from "react";

const Slider = React.forwardRef(({ className, min, max, step, value, onValueChange, ...props }, ref) => {
  const handleChange = (e) => {
    const val = parseInt(e.target.value);
    if (onValueChange) {
      // If it's a range, we just update the second value for simplicity in this mock
      if (Array.isArray(value) && value.length > 1) {
        onValueChange([value[0], val]);
      } else {
        onValueChange([val]);
      }
    }
  };

  return (
    <div className={`relative flex w-full touch-none select-none items-center ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Array.isArray(value) ? value[value.length - 1] : value}
        onChange={handleChange}
        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        ref={ref}
        {...props}
      />
    </div>
  );
});
Slider.displayName = "Slider";

export { Slider };
