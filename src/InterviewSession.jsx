import React, { useState, useEffect, useRef } from 'react';
import { getGroqChatCompletion, getGroqChatStream } from './services/groqService';
import { saveInterviewSession, updateInterviewSession } from './services/interviewService';
import { speak, cancelSpeech } from './services/voiceService';
import { generateSystemPrompt } from './utils/promptUtils';
import { useWhisper } from './hooks/useWhisper';
import { formatTime } from './utils/formatUtils';
import { evaluateInterview } from './services/evaluationService';
import { getRelevantContext } from './services/knowledgeService';
import { getRealtimeSuggestion } from './services/suggestionService';

const InterviewSession = ({ config, user, onEnd }) => {
  const [messages, setMessages] = useState([]);
  const [suggestion, setSuggestion] = useState(null);
  const [tipPage, setTipPage] = useState(0); // 0: Feedback, 1: Suggested Response
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [input, setInput] = useState('');
  const [timer, setTimer] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [apiMessages, setApiMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('vantage_voice_settings');
    return saved ? !JSON.parse(saved).autoSpeak : false;
  });
  
  const messagesEndRef = useRef(null);
  const { isRecording, sttError, interimText, toggleRecording, startRecording } = useWhisper(config);

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
        speak(fullResponse, () => {
          setIsSpeaking(false);
          // Auto-turn on mic if not muted and recording isn't already active
          if (!isMuted && !isRecording && !isEnding) {
            startRecording();
          }
        });
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
    setIsProcessing(true);
    cancelSpeech();
    setIsSpeaking(false);

    const newMsgs = [...messages, { role: 'user', text: userText }];
    const newApiMsgs = [...apiMessages, { role: 'user', content: userText }];
    setMessages([...newMsgs, { role: 'ai', text: '' }]); 
    setApiMessages(newApiMsgs);
    setInput('');
    setIsProcessing(true);

    // Real-time Feedback (Triggered immediately after User response)
    if (config.enableSuggestions) {
      setIsSuggesting(true);
      getRealtimeSuggestion(newApiMsgs, config).then(tip => {
        setSuggestion(tip);
        setIsSuggesting(false);
      });
    }

    try {
      let fullResponse = '';
      await getGroqChatStream(newApiMsgs, (chunk) => {
        fullResponse = chunk;
        setMessages([...newMsgs, { role: 'ai', text: chunk }]);
      });
      
      setApiMessages([...newApiMsgs, { role: 'assistant', content: fullResponse }]);
      setIsSpeaking(true);
      speak(fullResponse, () => {
        setIsSpeaking(false);
        if (!isMuted && !isRecording && !isEnding) {
          startRecording();
        }
      });
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
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-3">
                    {isSpeaking && i === messages.length - 1 && (
                      <div className="flex gap-1 items-center">
                        <div className="w-0.5 h-2 bg-orange-500 animate-[pulse_0.5s_ease-in-out_infinite]" />
                        <div className="w-0.5 h-3 bg-orange-500 animate-[pulse_0.7s_ease-in-out_infinite]" />
                        <div className="w-0.5 h-2 bg-orange-500 animate-[pulse_0.5s_ease-in-out_infinite]" />
                      </div>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const newMuted = !isMuted;
                        setIsMuted(newMuted);
                        if (newMuted) cancelSpeech();
                        else if (i === messages.length - 1) speak(msg.text); // Replay last message if unmuting
                        
                        const saved = localStorage.getItem('vantage_voice_settings');
                        const settings = saved ? JSON.parse(saved) : { aiVoice: 'Natural Male (Max)', speed: 1.0, autoSpeak: true };
                        settings.autoSpeak = !newMuted;
                        localStorage.setItem('vantage_voice_settings', JSON.stringify(settings));
                      }}
                      className={`p-1.5 rounded-lg transition-all ${isMuted ? 'text-gray-600 hover:text-red-400' : 'text-orange-500 hover:bg-orange-500/10'}`}
                      title={isMuted ? "Unmute Voice" : "Mute Voice"}
                    >
                      {isMuted ? (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                      )}
                    </button>
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

      {/* Suggestion Area */}
      {config.enableSuggestions && (isSuggesting || (suggestion && (suggestion.feedback || suggestion.suggestion))) && (
        <div className="px-6 lg:px-10 pb-4 animate-in slide-in-from-bottom-2 duration-300">
          <div className="max-w-4xl mx-auto bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-start gap-4">
            <div className="p-2 bg-orange-500 rounded-lg text-black">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                {tipPage === 0 ? (
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM6.464 14.95a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 011.414-1.414l.707.707zM17.243 16.535a1 1 0 01-1.414 0l-.707-.707a1 1 0 111.414-1.414l.707.707a1 1 0 010 1.414z"/>
                ) : (
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                )}
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
                  {tipPage === 0 ? 'Instant Feedback' : 'Suggested Response'}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-orange-500/50 uppercase font-bold">{tipPage + 1}/2</span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setTipPage(0)}
                      disabled={tipPage === 0}
                      className="p-1 hover:bg-orange-500/20 rounded disabled:opacity-20 text-orange-500 transition"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <button 
                      onClick={() => setTipPage(1)}
                      disabled={tipPage === 1}
                      className="p-1 hover:bg-orange-500/20 rounded disabled:opacity-20 text-orange-500 transition"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-orange-100/80 leading-relaxed italic">
                {isSuggesting ? 'Generating coach advice...' : (tipPage === 0 ? suggestion?.feedback : suggestion?.suggestion)}
              </p>
            </div>
            <button onClick={() => setSuggestion(null)} className="text-orange-500/40 hover:text-orange-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-6 bg-[#111] border-t border-white/5">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <input 
            type="text" 
            value={isRecording ? (input + (interimText ? ' ' + interimText : '')) : input} 
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing || isEnding}
            placeholder={isProcessing ? "Max is typing..." : isRecording ? "Listening..." : "Type your response..."}
            className={`w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-32 py-4 outline-none transition disabled:opacity-50 ${isRecording ? 'text-orange-500/70 border-orange-500/30 font-medium' : 'text-white focus:border-orange-500'}`}
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
