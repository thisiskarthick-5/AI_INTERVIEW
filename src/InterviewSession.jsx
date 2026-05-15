import React, { useState, useEffect, useRef } from 'react';
import { getGroqChatCompletion, getGroqChatStream } from './services/groqService';
import { saveInterviewSession, updateInterviewSession } from './services/interviewService';
import { speak, cancelSpeech } from './services/voiceService';
import { generateSystemPrompt } from './utils/promptUtils';
import { useWhisper } from './hooks/useWhisper';
import { formatTime } from './utils/formatUtils';
import { evaluateInterview } from './services/evaluationService';
import { getRelevantContext } from './services/knowledgeService';

const InterviewSession = ({ config, user, onEnd }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [timer, setTimer] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [apiMessages, setApiMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef(null);
  const { isRecording, sttError, toggleRecording } = useWhisper(config);

  // Initialize Session
  useEffect(() => {
    const initSession = async () => {
      if (user?.uid && config && !sessionId) {
        saveInterviewSession(user.uid, config)
          .then(id => setSessionId(id))
          .catch(e => console.error('Session save error:', e));
      }

      const context = getRelevantContext(config);
      const systemPrompt = generateSystemPrompt(config, context);
      
      const initialApiMsgs = [{ role: 'system', content: systemPrompt }];
      setApiMessages(initialApiMsgs);
      
      setMessages([{ role: 'ai', text: '' }]);
      setIsProcessing(true);

      try {
        let fullResponse = '';
        await getGroqChatStream(initialApiMsgs, (chunk) => {
          fullResponse = chunk;
          setMessages([{ role: 'ai', text: chunk }]);
        });
        
        setApiMessages([...initialApiMsgs, { role: 'assistant', content: fullResponse }]);
        setIsSpeaking(true);
        speak(fullResponse);
      } catch (e) {
        setMessages([{ role: 'ai', text: `Error: ${e.message}. Please ensure VITE_GROQ_API_KEY is set.` }]);
      }
      setIsProcessing(false);
    };

    initSession();
    return () => {
      cancelSpeech();
      setIsSpeaking(false);
    };
  }, [config, user]);

  // UI Helpers
  useEffect(() => {
    const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    cancelSpeech();
    setIsSpeaking(false);

    const newMsgs = [...messages, { role: 'user', text: userText }];
    const newApiMsgs = [...apiMessages, { role: 'user', content: userText }];
    setMessages([...newMsgs, { role: 'ai', text: '' }]); 
    setApiMessages(newApiMsgs);

    try {
      let fullResponse = '';
      await getGroqChatStream(newApiMsgs, (chunk) => {
        fullResponse = chunk;
        setMessages([...newMsgs, { role: 'ai', text: chunk }]);
      });
      
      setApiMessages([...newApiMsgs, { role: 'assistant', content: fullResponse }]);
      setIsSpeaking(true);
      speak(fullResponse);
    } catch (e) {
      setMessages([...newMsgs, { role: 'ai', text: `Error: ${e.message}` }]);
    }
    setIsProcessing(false);
  };

  const handleEndSession = async () => {
    setIsEnding(true);
    cancelSpeech();
    
    try {
      if (sessionId) {
        const evaluation = await evaluateInterview(apiMessages, config);
        const sessionUpdate = {
          status: 'completed',
          duration: Math.max(1, Math.ceil(timer / 60)),
          score: evaluation.score,
          feedback: evaluation.feedback,
          suggestions: evaluation.suggestions,
          messages: apiMessages
        };
        await updateInterviewSession(sessionId, sessionUpdate);
        setIsEnding(false);
        onEnd(sessionUpdate);
        return;
      }
    } catch (error) {
      console.error('Final session update error:', error);
    } finally {
      setIsEnding(false);
      onEnd();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c0c] text-white animate-in fade-in duration-500 -m-6 lg:-m-10">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#111]">
        {!import.meta.env.VITE_GROQ_API_KEY && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-orange-500 text-black px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest animate-bounce shadow-2xl">
            ⚠️ API Key Missing: Set VITE_GROQ_API_KEY in .env.local
          </div>
        )}
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
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] uppercase font-bold tracking-tighter text-gray-400">Live Connection</span>
          </div>
          <span className="font-oswald text-xl text-orange-500">{formatTime(timer)}</span>
          <button 
            disabled={isEnding}
            onClick={() => {
              if (window.confirm("Are you sure you want to end this session? Your performance will be analyzed.")) {
                handleEndSession();
              }
            }} 
            className="px-6 py-2 bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-red-500 border border-white/10 hover:border-red-500/50 transition text-[10px] uppercase font-bold tracking-widest rounded-full disabled:opacity-50"
          >
            {isEnding ? 'Analyzing...' : 'End Session'}
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
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                  {msg.role === 'ai' ? 'Max (AI Interviewer)' : 'Candidate (You)'}
                </span>
                {msg.role === 'ai' && isProcessing && msg.text === '' && (
                   <div className="flex gap-1">
                    <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
                {msg.role === 'ai' && isSpeaking && i === messages.length - 1 && (
                  <div className="flex items-center gap-1 text-orange-500">
                    <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828a1 1 0 010-1.415z"/></svg>
                    <span className="text-[8px] uppercase font-bold tracking-widest">Speaking</span>
                  </div>
                )}
              </div>
              <p className="leading-relaxed whitespace-pre-wrap text-sm lg:text-base">
                {msg.text || (msg.role === 'ai' && isProcessing ? 'thinking...' : '')}
              </p>
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
            disabled={isProcessing || isEnding}
            placeholder={isProcessing ? "Max is typing..." : "Type your response..."}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-32 py-4 text-white outline-none focus:border-orange-500 transition disabled:opacity-50"
          />
          <div className="absolute right-2 top-2 flex gap-2">
            <button 
              type="button" onClick={handleVoiceToggle} disabled={isProcessing || isEnding}
              className={`p-2 rounded-xl transition ${isRecording ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-white/10 text-gray-400'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
            </button>
            <button 
              type="submit" disabled={isProcessing || isEnding || !input.trim()}
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
