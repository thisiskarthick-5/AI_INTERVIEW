import { speakNeural } from './localTTSEngine';

/**
 * Service for Text-to-Speech using Web Speech API or Local Neural AI.
 */
export const speak = async (text) => {
  if (!('speechSynthesis' in window)) return;
  
  // Get settings from localStorage
  const savedVoice = localStorage.getItem('vantage_voice_settings');
  const settings = savedVoice ? JSON.parse(savedVoice) : { aiVoice: 'Natural Male (Max)', speed: 1.0, autoSpeak: true };
  
  if (!settings.autoSpeak) return;

  // Route to Neural Engine if selected
  if (settings.aiVoice.startsWith('Neural')) {
    let voiceKey = 'af_bella'; // default
    if (settings.aiVoice.includes('Adam')) voiceKey = 'am_adam';
    else if (settings.aiVoice.includes('Nicole')) voiceKey = 'af_nicole';
    else if (settings.aiVoice.includes('Michael')) voiceKey = 'am_michael';
    else if (settings.aiVoice.includes('Emma')) voiceKey = 'bf_emma';
    else if (settings.aiVoice.includes('George')) voiceKey = 'bm_george';
    
    return speakNeural(text, voiceKey, settings.speed);
  }


  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = settings.speed || 1;
  utterance.pitch = 1;
  
  const setVoiceAndSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    let preferred;

    if (settings.aiVoice.includes('Female') || settings.aiVoice.includes('Sarah')) {
      preferred = voices.find(v => v.name.includes('Female') || v.name.includes('Google US English') || v.name.includes('Zira'))
        || voices.find(v => v.lang.startsWith('en-US'))
        || voices[0];
    } else if (settings.aiVoice.includes('Friendly') || settings.aiVoice.includes('Alex')) {
      preferred = voices.find(v => v.name.includes('Alex') || v.name.includes('Guy'))
        || voices.find(v => v.lang.startsWith('en-GB'))
        || voices[0];
    } else {
      // Default: Natural Male (Max)
      preferred = voices.find(v => v.name.includes('Google US English') || v.name.includes('David'))
        || voices.find(v => v.lang.startsWith('en-US'))
        || voices[0];
    }

    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    setVoiceAndSpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => { 
      setVoiceAndSpeak(); 
      window.speechSynthesis.onvoiceschanged = null; 
    };
  }
};


export const cancelSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

