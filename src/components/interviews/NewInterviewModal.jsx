import React, { useState } from 'react';

const NewInterviewModal = ({ isOpen, onClose, onStart }) => {
  const [targetRole, setTargetRole] = useState('');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [duration, setDuration] = useState('30');

  if (!isOpen) return null;

  const handleStart = () => {
    onStart({
      targetRole: targetRole || 'Software Engineer',
      interviewType,
      difficulty,
      duration: parseInt(duration)
    });
  };

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
            <input 
              type="text" 
              placeholder="e.g. Senior Frontend Engineer" 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition" 
            />
          </div>
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Interview Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setInterviewType('Technical')}
                className={`${interviewType === 'Technical' ? 'bg-orange-500/10 border-orange-500 text-orange-500' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'} border rounded-xl p-4 text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition`}
              >
                Technical
              </button>
              <button 
                onClick={() => setInterviewType('Behavioral')}
                className={`${interviewType === 'Behavioral' ? 'bg-orange-500/10 border-orange-500 text-orange-500' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'} border rounded-xl p-4 text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition`}
              >
                Behavioral
              </button>
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
            <select 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition appearance-none cursor-pointer"
            >
              <option value="15" className="bg-[#111]">15 Minutes (Quick Prep)</option>
              <option value="30" className="bg-[#111]">30 Minutes (Standard)</option>
              <option value="60" className="bg-[#111]">60 Minutes (Full Round)</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleStart} 
          className="w-full mt-8 bg-orange-500 text-black py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-orange-400 transition shadow-[0_0_15px_rgba(209,130,77,0.3)] cursor-pointer"
        >
          Start Mock Interview
        </button>
      </div>
    </div>
  );
};

export default NewInterviewModal;
