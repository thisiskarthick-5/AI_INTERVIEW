import React from 'react';

const Logo = ({ size = "md" }) => {
  const sizes = {
    sm: { container: "w-6 h-6", inner: "w-2 h-2", border: "border" },
    md: { container: "w-8 h-8", inner: "w-3 h-3", border: "border-2" },
    lg: { container: "w-10 h-10", inner: "w-4 h-4", border: "border-2" }
  };

  const { container, inner, border } = sizes[size] || sizes.md;

  return (
    <div className={`${container} ${border} border-orange-500 rotate-45 flex items-center justify-center shrink-0`}>
      <div className={`${inner} bg-orange-500 -rotate-45`}></div>
    </div>
  );
};

export default Logo;
