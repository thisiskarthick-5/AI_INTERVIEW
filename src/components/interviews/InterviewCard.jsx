import React, { useState } from 'react';

const InterviewCard = ({ role, date, score, status, duration, feedback, suggestions }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white/5 border ${isExpanded ? 'border-orange-500/50' : 'border-white/10'} rounded-2xl transition-all duration-300 overflow-hidden`}>
      <div 
        onClick={() => status === 'completed' && setIsExpanded(!isExpanded)}
        className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group cursor-pointer hover:bg-white/[0.02] transition`}
      >
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
          <button className={`px-6 py-2 border ${isExpanded ? 'bg-orange-500 border-orange-500 text-black' : 'border-white/10 group-hover:border-orange-500 group-hover:text-orange-500'} transition text-[10px] uppercase font-bold tracking-widest rounded-full`}>
            {status === 'completed' ? (isExpanded ? 'Close Report' : 'View Report') : 'Resume'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 pt-2 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
          <div className="grid md:grid-cols-2 gap-8 mt-4">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-3">Professional Feedback</h4>
              <p className="text-sm text-gray-300 leading-relaxed italic">"{feedback || 'No feedback available for this session.'}"</p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-blue-500 font-bold mb-3">Key Suggestions</h4>
              <ul className="space-y-2">
                {suggestions && suggestions.length > 0 ? (
                  suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-gray-400">
                      <span className="text-blue-500 mt-1">•</span>
                      {s}
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-gray-500">No specific suggestions generated.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewCard;
