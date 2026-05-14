import React, { useState, useEffect } from 'react';
import InterviewSession from './InterviewSession';
import { getUserInterviews } from './services/interviewService';
import NewInterviewModal from './components/interviews/NewInterviewModal';
import InterviewCard from './components/interviews/InterviewCard';

const InterviewPage = ({ user, interviews, setInterviews }) => {
  const [view, setView] = useState('list'); // 'list' or 'session'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionConfig, setSessionConfig] = useState(null);

  // Local fetch removed - data now flows from Dashboard

  if (view === 'session') {
    return <InterviewSession config={sessionConfig} user={user} onEnd={() => setView('list')} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <NewInterviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onStart={(config) => {
          setSessionConfig(config);
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
          {interviews.length > 0 ? (
            interviews.map(interview => (
              <InterviewCard 
                key={interview.id}
                role={interview.targetRole} 
                date={new Date(interview.createdAt?.toMillis ? interview.createdAt.toMillis() : Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} 
                duration={`${interview.duration} mins`} 
                score={interview.score} 
                status={interview.status} 
              />
            ))
          ) : (
            <div className="text-center p-8 border border-white/5 rounded-2xl">
              <p className="text-gray-500 text-sm">No interviews found. Start a new mock interview to get began!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
