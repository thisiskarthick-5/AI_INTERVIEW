import React from 'react';

const FeedbackSummary = ({ result, onBack }) => {
  if (!result) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <div className="inline-block px-4 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-500 text-[10px] font-bold uppercase tracking-widest">
          Interview Completed Successfully
        </div>
        <h2 className="text-5xl font-oswald uppercase tracking-tight">Performance Summary</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Main Score Card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-shrink-0 relative">
                 <svg className="w-40 h-40 transform -rotate-90">
                   <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                   <circle 
                     cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" 
                     strokeDasharray={440}
                     strokeDashoffset={440 - (440 * result.score) / 100}
                     className="text-orange-500 transition-all duration-1000 ease-out"
                   />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-4xl font-bold font-oswald">{result.score}%</span>
                   <span className="text-[10px] text-gray-500 uppercase font-bold">Readiness</span>
                 </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold">Expert Feedback</h3>
                <p className="text-lg text-gray-200 leading-relaxed italic font-light">
                  "{result.feedback}"
                </p>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
            <h3 className="text-xl font-oswald uppercase tracking-wider mb-6">Personalized Suggestions</h3>
            <div className="grid gap-4">
              {result.suggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-blue-500/30 transition">
                  <div className="w-8 h-8 bg-blue-500/20 text-blue-500 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* Quick Stats */}
           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Duration</p>
                <p className="text-xl font-bold">{result.duration} Minutes</p>
              </div>
              <div className="h-px bg-white/5" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Status</p>
                <p className="text-xl font-bold text-green-500 uppercase tracking-tighter">Analyzed</p>
              </div>
           </div>

           {/* Action Buttons */}
           <div className="space-y-4">
             <button 
               onClick={onBack}
               className="w-full py-4 bg-orange-500 text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-orange-400 transition shadow-[0_0_20px_rgba(209,130,77,0.3)]"
             >
               Return to Dashboard
             </button>
             <button 
               className="w-full py-4 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition"
             >
               Download Report
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSummary;
