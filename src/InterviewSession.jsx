import React, { useState, useEffect, useRef } from 'react';
import { getGroqChatCompletion } from './services/groqService';
import { saveInterviewSession, updateInterviewSession } from './services/interviewService';
import { speak, cancelSpeech } from './services/voiceService';
import { generateSystemPrompt } from './utils/promptUtils';
import { useWhisper } from './hooks/useWhisper';

const InterviewSession = ({ config, user, onEnd }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [timer, setTimer] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiMessages, setApiMessages] = useState([]);
  
  const messagesEndRef = useRef(null);
  const { isRecording, sttError, toggleRecording } = useWhisper(config);

  // Initialize Session
  useEffect(() => {
    const initSession = async () => {
      if (user?.uid && config) {
        saveInterviewSession(user.uid, config)
          .then(id => setSessionId(id))
          .catch(e => console.error('Session save error:', e));
      }

      const systemPrompt = generateSystemPrompt(config);
      const initialApiMsgs = [{ role: 'system', content: systemPrompt }];
      setApiMessages(initialApiMsgs);
      
      setMessages([{ role: 'ai', text: '...' }]);
      setIsProcessing(true);

      try {
        const response = await getGroqChatCompletion(initialApiMsgs);
        setMessages([{ role: 'ai', text: response }]);
        setApiMessages([...initialApiMsgs, { role: 'assistant', content: response }]);
        speak(response);
      } catch (e) {
        setMessages([{ role: 'ai', text: `Error: ${e.message}` }]);
      }
      setIsProcessing(false);
    };

    initSession();
    return () => cancelSpeech();
  }, [config, user]);

  // UI Helpers
  useEffect(() => {
    const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Handlers
  const handleVoiceToggle = async () => {
    const transcribedText = await toggleRecording();
    if (transcribedText) {
      setInput(prev => prev ? `${prev} ${transcribedText}` : transcribedText);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    const userText = input.trim();
    setInput('');
    setIsProcessing(true);

    const newMsgs = [...messages, { role: 'user', text: userText }];
    const newApiMsgs = [...apiMessages, { role: 'user', content: userText }];
    setMessages([...newMsgs, { role: 'ai', text: '...' }]);
    setApiMessages(newApiMsgs);

    try {
      const response = await getGroqChatCompletion(newApiMsgs);
      setMessages([...newMsgs, { role: 'ai', text: response }]);
      setApiMessages([...newApiMsgs, { role: 'assistant', content: response }]);
      speak(response);
    } catch (e) {
      setMessages([...newMsgs, { role: 'ai', text: `Error: ${e.message}` }]);
    }
    setIsProcessing(false);
  };

  const handleEndSession = async () => {
    if (sessionId) {
      const score = Math.floor(Math.random() * 41) + 60;
      updateInterviewSession(sessionId, {
        status: 'completed',
        duration: Math.max(1, Math.ceil(timer / 60)),
        score,
        messages: apiMessages
      }).catch(console.error);
    }
    onEnd();
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c0c] text-white animate-in fade-in duration-500 -m-6 lg:-m-10">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#111]">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <div>
            <h2 className="font-oswald uppercase tracking-wider text-lg">Active Session</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              {config?.targetRole} • {config?.interviewType}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-oswald text-xl text-orange-500">{formatTime(timer)}</span>
          <button onClick={handleEndSession} className="px-6 py-2 bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-red-500 border border-white/10 hover:border-red-500/50 transition text-[10px] uppercase font-bold tracking-widest rounded-full">
            End Session
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl p-6 rounded-2xl border ${
              msg.role === 'user' 
                ? 'bg-orange-500/10 border-orange-500/30 text-orange-50 rounded-br-none' 
                : 'bg-white/5 border-white/10 text-gray-300 rounded-bl-none'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                  {msg.role === 'ai' ? 'Max' : 'Candidate'}
                </span>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#111] border-t border-white/5">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder={isProcessing ? "Max is typing..." : "Type your response..."}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-32 py-4 text-white outline-none focus:border-orange-500 transition disabled:opacity-50"
          />
          <div className="absolute right-2 top-2 flex gap-2">
            <button 
              type="button" onClick={handleVoiceToggle} disabled={isProcessing}
              className={`p-2 rounded-xl transition ${isRecording ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-white/10 text-gray-400'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
            </button>
            <button 
              type="submit" disabled={isProcessing || !input.trim()}
              className="px-6 bg-orange-500 text-black font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-orange-400 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
        {isRecording && <p className="text-center mt-2 text-[10px] text-red-400 animate-pulse uppercase tracking-widest">Recording...</p>}
        {sttError && <p className="text-center mt-2 text-[10px] text-orange-400 uppercase tracking-widest">{sttError}</p>}
      </div>
    </div>
  );
};

export default InterviewSession;
