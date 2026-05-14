import React from 'react';

const ProgressBar = ({ label, progress, color = "bg-orange-500" }) => (
  <div className="mb-4">
    <div className="flex justify-between text-xs uppercase tracking-widest mb-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-bold">{progress}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-1000`} 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

export default ProgressBar;
