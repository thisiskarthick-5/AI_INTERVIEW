import React, { useState, useEffect } from 'react';
import { checkModelStatus, downloadModel, deleteModel } from './services/localTTSEngine';

const SettingsPage = ({ user, onLogout }) => {
  const [profile, setProfile] = useState({
    name: user?.displayName || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    defaultRole: 'Software Engineer',
    defaultDifficulty: 'Intermediate'
  });

  const [voiceSettings, setVoiceSettings] = useState({
    aiVoice: 'Natural Male (Max)',
    speed: 1.0,
    autoSpeak: true
  });

  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GROQ_API_KEY || '');
  const [showKey, setShowKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  
  const [modelStatus, setModelStatus] = useState('loading'); // loading, ready, not_downloaded
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Load settings on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('vantage_profile');
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    const savedVoice = localStorage.getItem('vantage_voice_settings');
    if (savedVoice) setVoiceSettings(JSON.parse(savedVoice));
    
    const savedKey = localStorage.getItem('vantage_groq_key');
    if (savedKey) setApiKey(savedKey);

    checkModelStatus().then(status => setModelStatus(status));
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    const success = await downloadModel((progress) => {
      setDownloadProgress(progress);
    });
    setIsDownloading(false);
    if (success) {
      setModelStatus('ready');
      // Automatically switch to a neural voice if just installed
      setVoiceSettings(prev => ({ ...prev, aiVoice: 'Neural Expressive (Bella)' }));
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to remove the high-fidelity AI models? This will free up ~80MB but you'll lose access to expressive voices.")) {
      await deleteModel();
      setModelStatus('not_downloaded');
      setVoiceSettings(prev => ({ ...prev, aiVoice: 'Natural Male (Max)' }));
    }
  };

  const handleSave = () => {
    localStorage.setItem('vantage_profile', JSON.stringify(profile));
    localStorage.setItem('vantage_voice_settings', JSON.stringify(voiceSettings));
    localStorage.setItem('vantage_groq_key', apiKey);
    
    setSaveStatus('Settings Saved!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-oswald uppercase tracking-tight mb-2">Account Settings</h2>
          <p className="text-gray-400 text-sm">Manage your profile, interview preferences, and system configuration.</p>
        </div>
        <div className="flex items-center gap-4">
          {saveStatus && <span className="text-orange-500 text-[10px] uppercase font-bold tracking-widest animate-pulse">{saveStatus}</span>}
          <button 
            onClick={handleSave}
            className="px-8 py-3 bg-orange-500 text-black hover:bg-orange-400 transition rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(209,130,77,0.3)]"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid gap-10">
        
        {/* Profile Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-lg font-oswald uppercase tracking-wider">Profile Information</h3>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Full Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl p-4 text-sm focus:border-orange-500 outline-none transition" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Email Address</label>
              <input 
                type="email" 
                value={profile.email}
                disabled
                className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl p-4 text-sm text-gray-500 cursor-not-allowed outline-none" 
              />
            </div>
          </div>
        </div>

        {/* Interview Preferences */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-lg font-oswald uppercase tracking-wider">Interview Preferences</h3>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Default Target Role</label>
              <select 
                value={profile.defaultRole}
                onChange={(e) => setProfile({...profile, defaultRole: e.target.value})}
                className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl p-4 text-sm focus:border-orange-500 outline-none transition appearance-none"
              >
                <option>Software Engineer</option>
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>Fullstack Engineer</option>
                <option>Product Manager</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Default Difficulty</label>
              <div className="grid grid-cols-2 gap-2">
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(level => (
                  <button 
                    key={level}
                    onClick={() => setProfile({...profile, defaultDifficulty: level})}
                    className={`p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition ${
                      profile.defaultDifficulty === level 
                        ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(209,130,77,0.3)]' 
                        : 'bg-[#0c0c0c] border border-white/10 text-gray-500 hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Neural AI Voices (Optional Download) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden border-orange-500/20">
          <div className="p-6 border-b border-white/5 bg-orange-500/[0.02]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                <h3 className="text-lg font-oswald uppercase tracking-wider">High-Fidelity AI Voices (Neural)</h3>
              </div>
              {modelStatus === 'ready' && (
                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[8px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">
                  Model Installed
                </span>
              )}
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <p className="text-sm font-bold mb-1">Local Neural Engine (Experimental)</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Upgrade to ultra-realistic, expressive AI voices that run entirely on your device. 
                This requires a one-time <span className="text-orange-500 font-bold">~80MB download</span>.
              </p>
            </div>

            {modelStatus === 'not_downloaded' && !isDownloading && (
              <button 
                onClick={handleDownload}
                className="w-full py-4 bg-white/5 border border-dashed border-white/20 hover:border-orange-500/50 hover:bg-orange-500/5 transition rounded-xl flex items-center justify-center gap-3 group"
              >
                <svg className="w-4 h-4 text-gray-500 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 group-hover:text-white">Download Neural Assets</span>
              </button>
            )}

            {isDownloading && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500 animate-pulse">Downloading AI Model...</span>
                  <span className="text-[10px] font-bold">{downloadProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-300" 
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {modelStatus === 'ready' && (
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                   </div>
                   <div>
                     <p className="text-[10px] uppercase font-bold tracking-widest text-white">Neural Mode Active</p>
                     <p className="text-[9px] text-gray-500 uppercase">Expressive voices enabled in selection</p>
                   </div>
                </div>
                <button 
                  onClick={handleDelete}
                  className="text-[9px] uppercase font-bold text-gray-500 hover:text-red-500 transition"
                >
                  Remove Assets
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Voice & System */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-lg font-oswald uppercase tracking-wider">Voice & AI Settings</h3>
          </div>
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Auto-Speak Responses</p>
                <p className="text-[10px] text-gray-500 uppercase">Automatically play AI voice feedback</p>
              </div>
              <button 
                onClick={() => setVoiceSettings({...voiceSettings, autoSpeak: !voiceSettings.autoSpeak})}
                className={`w-12 h-6 rounded-full transition-colors relative ${voiceSettings.autoSpeak ? 'bg-orange-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${voiceSettings.autoSpeak ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">AI Interviewer Voice</label>
                <select 
                  value={voiceSettings.aiVoice}
                  onChange={(e) => setVoiceSettings({...voiceSettings, aiVoice: e.target.value})}
                  className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl p-4 text-sm focus:border-orange-500 outline-none transition appearance-none"
                >
                  <option>Natural Male (Max)</option>
                  <option>Professional Female (Sarah)</option>
                  <option>Friendly (Alex)</option>
                  {modelStatus === 'ready' && (
                    <>
                      <option disabled className="text-gray-600">--- Neural AI (Expressive) ---</option>
                      <option>Neural Expressive (Bella)</option>
                      <option>Neural Professional (Adam)</option>
                      <option>Neural Friendly (Nicole)</option>
                      <option>Neural Deep (Michael)</option>
                      <option>Neural British (Emma)</option>
                      <option>Neural British (George)</option>
                    </>
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Voice Speed ({voiceSettings.speed}x)</label>
                <input 
                  type="range" min="0.5" max="2" step="0.1" 
                  value={voiceSettings.speed}
                  onChange={(e) => setVoiceSettings({...voiceSettings, speed: parseFloat(e.target.value)})}
                  className="w-full accent-orange-500 mt-4" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden border-orange-500/20">
          <div className="p-6 border-b border-white/5 bg-orange-500/[0.02]">
             <div className="flex items-center gap-3">
               <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
               <h3 className="text-lg font-oswald uppercase tracking-wider">Developer & API</h3>
             </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Groq API Key</label>
              <div className="relative">
                <input 
                  type={showKey ? 'text' : 'password'} 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl p-4 pr-24 text-sm focus:border-orange-500 outline-none transition font-mono" 
                />
                <button 
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-gray-500 hover:text-white transition"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-[10px] text-gray-600 uppercase tracking-tighter">Your key is stored locally and used for real-time AI processing.</p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-8 border border-red-500/20 bg-red-500/[0.02] rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-sm font-bold text-red-500 uppercase tracking-wider">Danger Zone</h4>
            <p className="text-xs text-gray-500">Signing out will end your current session and clear local state.</p>
          </div>
          <button 
            onClick={onLogout}
            className="px-8 py-3 bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition rounded-xl text-[10px] font-bold uppercase tracking-widest"
          >
            Sign Out of Vantage
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
