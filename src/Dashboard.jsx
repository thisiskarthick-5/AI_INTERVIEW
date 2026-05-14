import React, { useState, useEffect } from 'react';
import InterviewPage from './InterviewPage';
import { getUserInterviews } from './services/interviewService';
import StatCard from './components/common/StatCard';
import ProgressBar from './components/common/ProgressBar';
import PerformanceChart from './components/dashboard/PerformanceChart';
import Sidebar from './components/layout/Sidebar';

const Dashboard = ({ user, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('Dashboard');
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({ attended: 0, score: 0 });

  useEffect(() => {
    if (user?.uid) {
      getUserInterviews(user.uid).then(data => {
        setInterviews(data);
        const completed = data.filter(i => i.status === 'completed' && i.score != null);
        const avgScore = completed.length > 0 
          ? Math.round(completed.reduce((acc, curr) => acc + curr.score, 0) / completed.length) 
          : 0;
        setStats({ attended: data.length, score: avgScore });
      }).catch(console.error);
    }
  }, [user]);

  return (
    <div className="flex min-h-screen bg-[#0c0c0c] text-white overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 h-screen overflow-y-auto p-6 lg:p-10">
      {/* Header */}
      <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border-2 border-orange-500 rotate-45 flex items-center justify-center">
             <div className="w-4 h-4 bg-orange-500 -rotate-45"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase font-oswald">Vantage Dashboard</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Logged in as {user?.email}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="px-6 py-2 border border-white/10 hover:border-orange-500/50 hover:text-orange-500 transition text-[10px] uppercase font-bold tracking-widest rounded-full cursor-pointer"
        >
          Sign Out
        </button>
      </header>

      {activeView === 'Dashboard' && (
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column - Main Stats */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-orange-500/10 to-transparent p-8 border-l-4 border-orange-500 rounded-r-2xl">
            <h2 className="text-4xl font-oswald uppercase mb-2">Welcome back, {user?.email?.split('@')[0]}</h2>
            <p className="text-gray-400 text-sm max-w-lg">
              You've maintained your streak for 5 days! Keep it up to reach your weekly readiness goal.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Interviews Attended" 
              value={stats.attended.toString()} 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>}
            />
            <StatCard 
              title="Readiness Score" 
              value={`${stats.score}%`} 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
            />
            <StatCard 
              title="Current Streak" 
              value="1 Day" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
            />
          </div>

          {/* Weekly Goal Progress */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-oswald uppercase tracking-wider">Weekly Progress</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Goal: 5 Mock Interviews</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-oswald text-orange-500">60%</span>
              </div>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 w-[60%] shadow-[0_0_15px_rgba(209,130,77,0.3)]"></div>
            </div>
            <div className="flex justify-between mt-4">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${i < 3 ? 'bg-orange-500 shadow-[0_0_8px_rgba(209,130,77,0.8)]' : 'bg-white/10'}`}></div>
                  <span className="text-[9px] text-gray-600 font-bold">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Analytics */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-oswald uppercase tracking-wider">Performance Analytics</h3>
              <select className="bg-transparent border border-white/10 text-[10px] uppercase p-2 rounded outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <PerformanceChart />
          </div>

          {/* Weekly Progress */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
            <h3 className="text-xl font-oswald uppercase tracking-wider mb-8">Skill Proficiency</h3>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-2">
              <ProgressBar label="Communication" progress={92} />
              <ProgressBar label="Technical Logic" progress={78} />
              <ProgressBar label="Problem Solving" progress={85} />
              <ProgressBar label="Confidence Level" progress={90} />
            </div>
          </div>
        </div>

        {/* Right Column - Activity & Upcoming */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Upcoming Interviews (Mocked for now as we don't have a schedule feature yet) */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-lg font-oswald uppercase tracking-wider mb-6">Upcoming</h3>
            <div className="space-y-4">
              {interviews.filter(i => i.status === 'in-progress').length > 0 ? (
                interviews.filter(i => i.status === 'in-progress').slice(0, 2).map((item, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold group-hover:text-orange-500 transition">{item.targetRole}</span>
                      <span className="text-[10px] text-orange-500 font-bold uppercase">Resume Now</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{item.interviewType}</span>
                    </div>
                    {i < 1 && <div className="mt-4 border-b border-white/5"></div>}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">No active sessions. Start a new one!</p>
              )}
              <button onClick={() => setActiveView('Interviews')} className="w-full mt-4 py-3 border border-dashed border-white/10 text-gray-500 hover:text-white hover:border-white/30 transition text-[10px] uppercase font-bold tracking-widest rounded-lg">
                + New Practice
              </button>
            </div>
          </div>

          {/* Recent Activity (Real Data) */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-lg font-oswald uppercase tracking-wider mb-6">Recent Activity</h3>
            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-white/5">
              {interviews.filter(i => i.status === 'completed').length > 0 ? (
                interviews.filter(i => i.status === 'completed').slice(0, 3).map((activity, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute left-0 top-1 w-4 h-4 bg-orange-500/20 border border-orange-500/50 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    </div>
                    <p className="text-xs font-bold">Interview Completed</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter mb-1">{activity.targetRole} • {activity.interviewType}</p>
                    <div className="flex justify-between text-[9px] uppercase tracking-widest">
                      <span className="text-gray-600">
                        {new Date(activity.createdAt?.toMillis ? activity.createdAt.toMillis() : Date.now()).toLocaleDateString()}
                      </span>
                      <span className="text-orange-500 font-bold">{activity.score}/100</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-gray-500 italic ml-8">No completed interviews yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
      )}
      
      {activeView === 'Interviews' && <InterviewPage user={user} interviews={interviews} setInterviews={setInterviews} />}
      {activeView === 'Analytics' && <div className="flex items-center justify-center h-64 border border-dashed border-white/10 rounded-2xl text-gray-500 text-sm tracking-widest uppercase">Analytics Coming Soon</div>}
      {activeView === 'Settings' && <div className="flex items-center justify-center h-64 border border-dashed border-white/10 rounded-2xl text-gray-500 text-sm tracking-widest uppercase">Settings Coming Soon</div>}
      </div>
    </div>
  );
};

export default Dashboard;
