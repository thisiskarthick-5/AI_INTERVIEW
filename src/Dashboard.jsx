import React, { useState } from 'react';

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

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>, label: 'Dashboard', active: true },
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>, label: 'Interviews' },
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>, label: 'Analytics' },
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>, label: 'Settings' },
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 border-r border-white/5 bg-[#0c0c0c] flex flex-col shrink-0`}>
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-white/5 min-h-[88px]`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-orange-500 rotate-45 flex items-center justify-center shrink-0">
               <div className="w-3 h-3 bg-orange-500 -rotate-45"></div>
            </div>
            <span className="font-oswald text-xl uppercase font-bold tracking-wider text-white">Vantage</span>
          </div>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition shrink-0 cursor-pointer">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
      <div className="flex-1 py-6 flex flex-col gap-2 px-4">
        {menuItems.map((item, i) => (
           <button 
             key={i} 
             className={`flex items-center gap-4 p-3 rounded-xl transition cursor-pointer ${
               item.active 
                 ? 'bg-orange-500/10 text-orange-500' 
                 : 'text-gray-400 hover:bg-white/5 hover:text-white'
             } ${isCollapsed ? 'justify-center' : ''}`}
             title={isCollapsed ? item.label : undefined}
           >
             <div className={item.active ? 'text-orange-500' : 'text-current'}>{item.icon}</div>
             {!isCollapsed && <span className="text-xs uppercase tracking-widest font-bold whitespace-nowrap">{item.label}</span>}
           </button>
        ))}
      </div>
    </div>
  );
};

const Dashboard = ({ user, onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0c0c0c] text-white overflow-hidden">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      
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
          className="px-6 py-2 border border-white/10 hover:border-orange-500/50 hover:text-orange-500 transition text-[10px] uppercase font-bold tracking-widest rounded-full"
        >
          Sign Out
        </button>
      </header>

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
              value="12" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>}
              trend={15}
            />
            <StatCard 
              title="Readiness Score" 
              value="84%" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
              trend={5}
            />
            <StatCard 
              title="Current Streak" 
              value="5 Days" 
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
          
          {/* Upcoming Interviews */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-lg font-oswald uppercase tracking-wider mb-6">Upcoming</h3>
            <div className="space-y-4">
              {[
                { role: 'Senior React Dev', company: 'TechFlow', date: 'May 16, 10:00 AM' },
                { role: 'Product Designer', company: 'Nexus', date: 'May 18, 02:30 PM' }
              ].map((item, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold group-hover:text-orange-500 transition">{item.role}</span>
                    <span className="text-[10px] text-orange-500 font-bold uppercase">{item.date.split(',')[0]}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{item.company}</span>
                    <span className="text-[10px] text-gray-600 uppercase tracking-tighter">{item.date.split(',')[1]}</span>
                  </div>
                  {i < 1 && <div className="mt-4 border-b border-white/5"></div>}
                </div>
              ))}
              <button className="w-full mt-4 py-3 border border-dashed border-white/10 text-gray-500 hover:text-white hover:border-white/30 transition text-[10px] uppercase font-bold tracking-widest rounded-lg">
                + Schedule Practice
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-lg font-oswald uppercase tracking-wider mb-6">Recent Activity</h3>
            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-white/5">
              {[
                { action: 'Completed Mock Interview', target: 'Frontend Lead', time: '2 hours ago', score: '88/100' },
                { action: 'Skill Level Up', target: 'Communication', time: 'Yesterday', score: 'Level 4' },
                { action: 'Review Session', target: 'Behavioral Prep', time: '2 days ago', score: '32 mins' }
              ].map((activity, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute left-0 top-1 w-4 h-4 bg-orange-500/20 border border-orange-500/50 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  </div>
                  <p className="text-xs font-bold">{activity.action}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-tighter mb-1">{activity.target}</p>
                  <div className="flex justify-between text-[9px] uppercase tracking-widest">
                    <span className="text-gray-600">{activity.time}</span>
                    <span className="text-orange-500 font-bold">{activity.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
