import { KokoroTTS as Kokoro } from 'kokoro-js';

/**
 * Service for managing local neural TTS models (Kokoro).
 */

const MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX';
let kokoroInstance = null;

export const checkModelStatus = async () => {
  const isInstalled = localStorage.getItem('vantage_neural_tts_installed') === 'true';
  return isInstalled ? 'ready' : 'not_downloaded';
};

export const downloadModel = async (onProgress) => {
  try {
    const progressMap = new Map();

    const progress_callback = (progressInfo) => {
      if (progressInfo.status === 'progress') {
        progressMap.set(progressInfo.file, progressInfo.progress);
        
        // Calculate average progress across all active files
        const totalProgress = Array.from(progressMap.values()).reduce((a, b) => a + b, 0);
        const averageProgress = Math.round(totalProgress / Math.max(1, progressMap.size));
        onProgress(averageProgress);
      } else if (progressInfo.status === 'done') {
        progressMap.set(progressInfo.file, 100);
        const totalProgress = Array.from(progressMap.values()).reduce((a, b) => a + b, 0);
        const averageProgress = Math.round(totalProgress / Math.max(1, progressMap.size));
        onProgress(averageProgress);
      }
    };

    kokoroInstance = await Kokoro.from_pretrained(MODEL_ID, {
      dtype: 'fp32',
      device: 'wasm',
      progress_callback,
    });
    
    onProgress(100);
    localStorage.setItem('vantage_neural_tts_installed', 'true');
    return true;
  } catch (error) {
    console.error('Neural TTS Init Error:', error);
    return false;
  }
};


export const deleteModel = async () => {
  // Clear any cached model data if possible.
  // kokoro-js uses the browser's Cache API internally via Transformers.js
  if ('caches' in window) {
    const keys = await caches.keys();
    for (const key of keys) {
      if (key.includes('transformers-cache')) {
        await caches.delete(key);
      }
    }
  }
  kokoroInstance = null;
  localStorage.removeItem('vantage_neural_tts_installed');
  return true;
};

export const speakNeural = async (text, voice = 'af_bella', speed = 1.0) => {
  try {
    if (!kokoroInstance) {
      kokoroInstance = await Kokoro.from_pretrained(MODEL_ID, {
        dtype: 'fp32',
        device: 'wasm',
      });
    }

    const audio = await kokoroInstance.generate(text, {
      voice: voice,
      speed: speed,
    });
    
    audio.play();
  } catch (error) {
    console.error('Neural Speak Error:', error);
    // Fallback logic handled by the caller or UI
  }
};

