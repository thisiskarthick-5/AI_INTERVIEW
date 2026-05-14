import React from 'react';

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
        {icon}
      </div>
      {trend && (
        <span className={`text-xs font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{title}</p>
    <h3 className="text-3xl font-bold font-oswald tracking-tight">{value}</h3>
  </div>
);

export default StatCard;
