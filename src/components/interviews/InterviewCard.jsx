import React from 'react';

const InterviewCard = ({ role, date, score, status, duration }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:border-white/20 transition cursor-pointer">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xl font-bold group-hover:text-orange-500 transition">{role}</h3>
        {status === 'completed' ? (
          <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] uppercase font-bold tracking-wider rounded">Completed</span>
        ) : (
          <span className="px-2 py-1 bg-orange-500/10 text-orange-500 text-[10px] uppercase font-bold tracking-wider rounded">In Progress</span>
        )}
      </div>
      <div className="flex items-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest">
        <span>{date}</span>
        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
        <span>{duration}</span>
      </div>
    </div>
    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
      {score && (
        <div className="text-right">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Score</p>
          <p className="text-2xl font-bold font-oswald text-orange-500">{score}/100</p>
        </div>
      )}
      <button className="px-6 py-2 border border-white/10 hover:border-orange-500 hover:text-orange-500 transition text-[10px] uppercase font-bold tracking-widest rounded-full">
        {status === 'completed' ? 'View Report' : 'Resume'}
      </button>
    </div>
  </div>
);

export default InterviewCard;
