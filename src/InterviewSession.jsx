import React, { useState, useEffect } from 'react';

const InterviewSession = ({ onEnd }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'll be conducting your technical interview today. To start, could you please introduce yourself and walk me through your most recent project?" }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    
    // Mock AI response
    setTimeout(() => {
      setMessages([...newMessages, { role: 'ai', text: "That sounds like an interesting project. Can you explain the most difficult technical challenge you faced while building it, and how you overcame it?" }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c0c] text-white animate-in fade-in duration-500 -m-6 lg:-m-10">
      {/* Session Header */}
      <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#111]">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
          <div>
            <h2 className="font-oswald uppercase tracking-wider text-lg">Active Session</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Senior Frontend Engineer • Technical</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-oswald text-xl text-orange-500">{formatTime(timer)}</span>
          <button onClick={onEnd} className="px-6 py-2 bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-red-500 border border-white/10 hover:border-red-500/50 transition text-[10px] uppercase font-bold tracking-widest rounded-full cursor-pointer">
            End Session
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl p-6 rounded-2xl border ${
              msg.role === 'user' 
                ? 'bg-orange-500/10 border-orange-500/30 text-orange-50 rounded-br-none' 
                : 'bg-white/5 border-white/10 text-gray-300 rounded-bl-none'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {msg.role === 'ai' ? (
                  <div className="w-6 h-6 border border-white/20 flex items-center justify-center rotate-45">
                    <div className="w-2 h-2 bg-white -rotate-45"></div>
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-orange-500">YOU</span>
                  </div>
                )}
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                  {msg.role === 'ai' ? 'Vantage AI' : 'Candidate'}
                </span>
              </div>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#111] border-t border-white/5">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response or use voice..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-32 py-4 text-white outline-none focus:border-orange-500 transition"
          />
          <div className="absolute right-2 top-2 flex gap-2">
            <button 
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                isRecording 
                  ? 'bg-red-500/20 text-red-500 border border-red-500/50' 
                  : 'hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
            </button>
            <button 
              type="submit"
              className="px-6 bg-orange-500 text-black font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-orange-400 transition cursor-pointer"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewSession;
