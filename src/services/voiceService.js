/**
 * Service for Text-to-Speech using Web Speech API.
 */
export const speak = (text, onEnd) => {
  if (!('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }
  
  const savedVoice = localStorage.getItem('vantage_voice_settings');
  const settings = savedVoice ? JSON.parse(savedVoice) : { aiVoice: 'Natural Male (Max)', speed: 1.0, autoSpeak: true };
  
  if (!settings.autoSpeak) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  
  if (onEnd) {
    utterance.onend = () => {
        console.log('[VoiceService] Speech finished');
        onEnd();
    };
  }
  
  const setVoiceAndSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'))
      || voices.find(v => v.lang.startsWith('en-US'))
      || voices.find(v => v.lang.startsWith('en'))
      || voices[0];
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
