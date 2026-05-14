import React, { useState } from 'react';
import InterviewSession from './InterviewSession';

const NewInterviewModal = ({ isOpen, onClose, onStart }) => {
  const [difficulty, setDifficulty] = useState('Intermediate');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        
        <h2 className="text-3xl font-oswald uppercase mb-6 text-white">Configure Session</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Target Role</label>
            <input type="text" placeholder="e.g. Senior Frontend Engineer" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition" />
          </div>
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Interview Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-orange-500/10 border border-orange-500 text-orange-500 rounded-xl p-4 text-xs font-bold uppercase tracking-wider text-center cursor-pointer">Technical</button>
              <button className="bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 rounded-xl p-4 text-xs font-bold uppercase tracking-wider text-center transition cursor-pointer">Behavioral</button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Difficulty</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(level => (
                <button 
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`rounded-xl p-3 text-[10px] font-bold uppercase tracking-wider text-center transition cursor-pointer ${
                    difficulty === level 
                      ? 'bg-orange-500/10 border border-orange-500 text-orange-500 shadow-[0_0_10px_rgba(209,130,77,0.2)]' 
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Duration</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition appearance-none cursor-pointer">
              <option value="15" className="bg-[#111]">15 Minutes (Quick Prep)</option>
              <option value="30" className="bg-[#111]">30 Minutes (Standard)</option>
              <option value="60" className="bg-[#111]">60 Minutes (Full Round)</option>
            </select>
          </div>
        </div>

        <button 
          onClick={onStart} 
          className="w-full mt-8 bg-orange-500 text-black py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-orange-400 transition shadow-[0_0_15px_rgba(209,130,77,0.3)] cursor-pointer"
        >
          Start Mock Interview
        </button>
      </div>
    </div>
  );
};

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

const InterviewPage = () => {
  const [view, setView] = useState('list'); // 'list' or 'session'
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (view === 'session') {
    return <InterviewSession onEnd={() => setView('list')} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <NewInterviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onStart={() => {
          setIsModalOpen(false);
          setView('session');
        }} 
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-oswald uppercase tracking-tight mb-2">Interviews</h2>
          <p className="text-gray-400 text-sm">Manage your mock interviews and review past performance.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-500 text-black px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-orange-400 transition shadow-[0_0_15px_rgba(209,130,77,0.3)] cursor-pointer"
        >
          + Start New Interview
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-orange-500/50 transition">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition"></div>
          <h3 className="text-xl font-oswald uppercase mb-2">Technical</h3>
          <p className="text-xs text-gray-400 mb-6">Algorithms, System Design, Language-specific</p>
          <div className="flex justify-between items-center text-orange-500">
            <span className="text-[10px] font-bold uppercase tracking-widest">12 Completed</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-orange-500/50 transition">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition"></div>
          <h3 className="text-xl font-oswald uppercase mb-2">Behavioral</h3>
          <p className="text-xs text-gray-400 mb-6">Leadership, Conflict Resolution, Culture Fit</p>
          <div className="flex justify-between items-center text-blue-500">
            <span className="text-[10px] font-bold uppercase tracking-widest">8 Completed</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-orange-500/50 transition">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition"></div>
          <h3 className="text-xl font-oswald uppercase mb-2">Custom Role</h3>
          <p className="text-xs text-gray-400 mb-6">Tailored to specific job descriptions</p>
          <div className="flex justify-between items-center text-purple-500">
            <span className="text-[10px] font-bold uppercase tracking-widest">3 Completed</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-oswald uppercase tracking-wider">Recent Interviews</h3>
          <button className="text-[10px] text-gray-400 hover:text-white uppercase tracking-widest font-bold transition cursor-pointer">View All</button>
        </div>
        <div className="space-y-4">
          <InterviewCard role="Senior React Developer" date="May 12, 2026" duration="45 mins" score={88} status="completed" />
          <InterviewCard role="Product Manager" date="May 10, 2026" duration="60 mins" score={92} status="completed" />
          <InterviewCard role="Frontend Engineer (Google)" date="May 14, 2026" duration="15 mins" score={null} status="in-progress" />
          <InterviewCard role="Backend Developer (Node.js)" date="May 05, 2026" duration="50 mins" score={75} status="completed" />
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
