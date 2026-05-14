import React, { useMemo } from 'react';
import StatCard from './components/common/StatCard';
import ProgressBar from './components/common/ProgressBar';
import { formatDate } from './utils/formatUtils';

const AnalyticsPage = ({ interviews }) => {
  const completedInterviews = useMemo(() => 
    interviews.filter(i => i.status === 'completed' && i.score != null), 
  [interviews]);

  const stats = useMemo(() => {
    if (completedInterviews.length === 0) return { avg: 0, highest: 0, totalMins: 0 };
    const sum = completedInterviews.reduce((acc, curr) => acc + curr.score, 0);
    const highest = Math.max(...completedInterviews.map(i => i.score));
    const totalMins = completedInterviews.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    return {
      avg: Math.round(sum / completedInterviews.length),
      highest,
      totalMins
    };
  }, [completedInterviews]);

  // Derive skill proficiency from multiple interviews (simulated logic based on scores)
  const skills = useMemo(() => [
    { label: 'Technical Depth', progress: Math.min(100, stats.avg + 5) },
    { label: 'Communication', progress: Math.min(100, stats.avg - 2) },
    { label: 'Problem Solving', progress: Math.min(100, stats.avg + 8) },
    { label: 'System Design', progress: Math.min(100, stats.avg - 5) },
    { label: 'Confidence', progress: Math.min(100, stats.avg + 3) },
    { label: 'Behavioral', progress: Math.min(100, stats.avg) },
  ], [stats.avg]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-oswald uppercase tracking-tight mb-2">Detailed Analytics</h2>
          <p className="text-gray-400 text-sm">Deep dive into your interview performance and skill progression.</p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] uppercase font-bold tracking-widest text-gray-500">
             Last 30 Days
           </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Avg. Readiness" 
          value={`${stats.avg}%`} 
          icon={<div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />}
        />
        <StatCard 
          title="Highest Score" 
          value={`${stats.highest}%`} 
          icon={<svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"/></svg>}
        />
        <StatCard 
          title="Total Practice" 
          value={`${stats.totalMins}m`} 
          icon={<svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
        />
        <StatCard 
          title="Sessions" 
          value={completedInterviews.length.toString()} 
          icon={<svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Score Trend */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
          <h3 className="text-xl font-oswald uppercase tracking-wider mb-8">Performance Trend</h3>
          <div className="h-64 flex items-end justify-between gap-4">
            {completedInterviews.length > 0 ? (
              completedInterviews.slice(-7).reverse().map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="relative w-full flex-1 flex items-end justify-center">
                    <div 
                      className="w-12 bg-gradient-to-t from-orange-500/20 to-orange-500/60 rounded-t-lg transition-all group-hover:to-orange-500 border-t border-orange-500/50"
                      style={{ height: `${item.score}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-orange-500 opacity-0 group-hover:opacity-100 transition">
                        {item.score}%
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-600 font-bold uppercase rotate-45 md:rotate-0 mt-2">
                    {formatDate(item.createdAt).split(',')[0]}
                  </span>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 uppercase text-[10px] tracking-widest border border-dashed border-white/5 rounded-xl">
                Insufficient Data
              </div>
            )}
          </div>
        </div>

        {/* Skill Proficiency */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
           <h3 className="text-xl font-oswald uppercase tracking-wider mb-8">Skill Mastery Breakdown</h3>
           <div className="space-y-6">
             {skills.map((skill, i) => (
               <ProgressBar key={i} label={skill.label} progress={skill.progress} />
             ))}
           </div>
        </div>
      </div>

      {/* Recent Insights */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
        <h3 className="text-xl font-oswald uppercase tracking-wider mb-6">Historical Insights</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-gray-500">
                <th className="pb-4 font-bold">Session Role</th>
                <th className="pb-4 font-bold">Difficulty</th>
                <th className="pb-4 font-bold">Score</th>
                <th className="pb-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {completedInterviews.slice(0, 5).map((session, i) => (
                <tr key={i} className="group">
                  <td className="py-4 text-sm font-bold group-hover:text-orange-500 transition">{session.targetRole}</td>
                  <td className="py-4 text-[10px] uppercase text-gray-400">{session.difficulty}</td>
                  <td className="py-4">
                    <span className={`text-sm font-bold ${session.score >= 80 ? 'text-green-500' : session.score >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                      {session.score}%
                    </span>
                  </td>
                  <td className="py-4 text-[10px] text-gray-500 uppercase">{formatDate(session.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {completedInterviews.length === 0 && (
            <p className="text-center py-10 text-gray-600 uppercase text-[10px] tracking-widest">Complete an interview to see data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
