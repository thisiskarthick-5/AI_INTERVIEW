import React, { useState, useEffect } from 'react';
import { saveResume, getUserResumes, analyzeResume } from './services/resumeService';
import StatCard from './components/common/StatCard';

const ResumePage = ({ user }) => {
  const [resumes, setResumes] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (user?.uid) {
      getUserResumes(user.uid).then(setResumes);
    }
  }, [user]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setAnalysis(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      try {
        const result = await analyzeResume(text);
        setAnalysis(result);
        
        await saveResume(user.uid, {
          fileName: file.name,
          atsScore: result.atsScore,
          summary: result.summary,
          analysis: result
        });
        
        getUserResumes(user.uid).then(setResumes);
      } catch (error) {
        console.error("Upload/Analysis failed:", error);
      } finally {
        setIsUploading(false);
      }
    };

    // For simplicity, we treat all as text. For PDF, you'd usually use a lib like pdfjs
    // but in this environment we'll assume text/plain or markdown for the demo.
    reader.readAsText(file);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div>
        <h2 className="text-4xl font-oswald uppercase tracking-tight mb-2">Resume Intelligence</h2>
        <p className="text-gray-400 text-sm">Optimize your resume for ATS and generate tailored interview prep.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Left Column: Upload & Current Analysis */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Upload Box */}
          <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-3xl p-10 text-center hover:border-orange-500/50 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/[0.02] transition-all" />
            <input 
              type="file" 
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              accept=".txt,.md,.pdf" 
            />
            <div className="relative z-0 space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
              </div>
              <div>
                <p className="text-lg font-bold">Click or drag to upload resume</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Supports PDF, TXT, MD (Max 5MB)</p>
              </div>
            </div>
          </div>

          {isUploading && (
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex items-center gap-6 animate-pulse">
              <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
              <div>
                <p className="text-sm font-bold uppercase tracking-widest">Analyzing {fileName}...</p>
                <p className="text-[10px] text-gray-500">Parsing structure and calculating ATS score</p>
              </div>
            </div>
          )}

          {analysis && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
               {/* Analysis Result */}
               <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8">
                  <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex items-center gap-6">
                       <div className="relative w-24 h-24">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                            <circle 
                              cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" 
                              strokeDasharray={251}
                              strokeDashoffset={251 - (251 * analysis.atsScore) / 100}
                              className="text-orange-500 transition-all duration-1000"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-bold font-oswald">{analysis.atsScore}%</span>
                            <span className="text-[7px] text-gray-500 uppercase font-bold">ATS Score</span>
                          </div>
                       </div>
                       <div>
                          <h3 className="text-xl font-oswald uppercase tracking-wider mb-1">Analysis Complete</h3>
                          <p className="text-xs text-gray-400 max-w-sm">{analysis.summary}</p>
                       </div>
                    </div>
                    <button className="h-fit px-6 py-2 bg-orange-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-orange-400 transition">
                      View Report
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mt-10">
                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest text-green-500 font-bold">Key Strengths</h4>
                      <ul className="space-y-2">
                        {analysis.strengths.map((s, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                            <span className="w-1 h-1 bg-green-500 rounded-full" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest text-red-500 font-bold">Areas for Improvement</h4>
                      <ul className="space-y-2">
                        {analysis.weaknesses.map((w, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                            <span className="w-1 h-1 bg-red-500 rounded-full" /> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
               </div>

               {/* Tailored Questions */}
               <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                  <h3 className="text-xl font-oswald uppercase tracking-wider mb-6">Resume-Based Questions</h3>
                  <div className="grid gap-4">
                    {analysis.questions.map((q, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-4 items-center group hover:border-orange-500/30 transition">
                         <span className="text-[10px] font-bold text-gray-600 group-hover:text-orange-500">Q{i+1}</span>
                         <p className="text-sm text-gray-300">{q}</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-oswald uppercase tracking-wider mb-6">Recent Uploads</h3>
              <div className="space-y-4">
                {resumes.length > 0 ? (
                  resumes.slice(0, 5).map((r, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold truncate pr-4 group-hover:text-orange-500 transition">{r.fileName}</span>
                        <span className="text-xs font-bold text-orange-500">{r.atsScore}%</span>
                      </div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                        {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </p>
                      {i < resumes.length - 1 && <div className="mt-4 border-b border-white/5"></div>}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">No resumes uploaded yet.</p>
                )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ResumePage;
