import React from 'react';

const Sidebar = ({ isCollapsed, setIsCollapsed, activeView, setActiveView }) => {
  const menuItems = [
    { 
      label: 'Dashboard', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> 
    },
    { 
      label: 'Interviews', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg> 
    },
    { 
      label: 'Analytics', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg> 
    },
    { 
      label: 'Settings', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> 
    },
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
        {menuItems.map((item, i) => {
           const active = activeView === item.label;
           return (
           <button 
             key={i} 
             onClick={() => setActiveView(item.label)}
             className={`flex items-center gap-4 p-3 rounded-xl transition cursor-pointer ${
               active 
                 ? 'bg-orange-500/10 text-orange-500' 
                 : 'text-gray-400 hover:bg-white/5 hover:text-white'
             } ${isCollapsed ? 'justify-center' : ''}`}
             title={isCollapsed ? item.label : undefined}
           >
             <div className={active ? 'text-orange-500' : 'text-current'}>{item.icon}</div>
             {!isCollapsed && <span className="text-xs uppercase tracking-widest font-bold whitespace-nowrap">{item.label}</span>}
           </button>
           );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
