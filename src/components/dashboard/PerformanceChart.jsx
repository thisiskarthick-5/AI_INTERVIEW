import React from 'react';

const PerformanceChart = () => (
  <div className="h-48 w-full mt-4 flex items-end justify-between gap-2">
    {[40, 70, 45, 90, 65, 80, 95].map((height, i) => (
      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
        <div className="relative w-full h-full flex items-end">
          <div 
            className="w-full bg-orange-500/20 group-hover:bg-orange-500/40 transition-all rounded-t-sm relative"
            style={{ height: `${height}%` }}
          >
            <div 
              className="absolute top-0 left-0 w-full h-1 bg-orange-500 shadow-[0_0_10px_rgba(209,130,77,0.5)]"
            ></div>
          </div>
        </div>
        <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Day {i+1}</span>
      </div>
    ))}
  </div>
);

export default PerformanceChart;
