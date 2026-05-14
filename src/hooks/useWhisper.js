import { useState, useRef } from 'react';

/**
 * Custom hook for handling audio recording and transcription via Groq Whisper.
 */
export const useWhisper = (config) => {
  const [isRecording, setIsRecording] = useState(false);
  const [sttError, setSttError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ];
    return types.find(t => MediaRecorder.isTypeSupported(t)) || '';
  };

  const startRecording = async () => {
    setSttError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 }
      });

      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      return stream;
    } catch (e) {
      if (e.name === 'NotAllowedError') {
        setSttError('Microphone access denied.');
      } else {
        setSttError(`Could not start microphone: ${e.message}`);
      }
      return null;
    }
  };

  const stopRecording = () => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) return resolve(null);

      mediaRecorderRef.current.onstop = async () => {
        const mimeType = mediaRecorderRef.current.mimeType;
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        
        if (audioBlob.size < 500) {
          setSttError('Recording too short.');
          resolve(null);
          return;
        }

        setSttError('Transcribing...');
        try {
          const ext = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('ogg') ? 'ogg' : 'webm';
          const formData = new FormData();
          formData.append('file', audioBlob, `audio.${ext}`);
          formData.append('model', 'whisper-large-v3');
          formData.append('language', 'en');
          formData.append('response_format', 'json');
          formData.append('prompt', `Technical interview for ${config?.targetRole || 'software engineer'}.`);

          const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: { Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` },
            body: formData,
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.error?.message || `Whisper error ${res.status}`);
          }

          const data = await res.json();
          setSttError('');
          resolve(data.text?.trim() || '');
        } catch (e) {
          setSttError(`Transcription failed: ${e.message}`);
          resolve(null);
        }
      };

      mediaRecorderRef.current.stop();
      setIsRecording(false);
    });
  };

  const toggleRecording = async () => {
    if (isRecording) {
      return await stopRecording();
    } else {
      await startRecording();
      return null;
    }
  };

  return { isRecording, sttError, toggleRecording };
};
