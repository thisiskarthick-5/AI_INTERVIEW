import React, { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import { useAuth } from './contexts/AuthContext';

const GridLines = () => (
  <div className="grid-lines">
    <div className="line"></div>
    <div className="line"></div>
    <div className="line"></div>
    <div className="line"></div>
  </div>
);

const Navbar = ({ onGetStarted }) => (
  <nav className="fixed w-full z-[100] flex justify-between items-center px-10 py-8 mix-blend-difference">
    <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
      <div className="w-6 h-6 border-2 border-white rotate-45"></div> VANTAGE AI
    </div>
    <div className="hidden md:flex gap-10 text-[10px] uppercase tracking-[0.2em] font-semibold">
      <a href="#about" className="hover:text-orange-400 transition">About Us</a>
      <a href="#ai" className="hover:text-orange-400 transition">The Technology</a>
      <a href="#faq" className="hover:text-orange-400 transition">FAQ</a>
    </div>
    <button onClick={onGetStarted} className="bg-white text-black px-8 py-3 rounded-full text-xs font-bold uppercase hover:bg-orange-500 transition">Get Started</button>
  </nav>
);

const Hero = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffset(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen bg-hero flex flex-col items-center justify-center text-center px-10">
      <div 
        className="relative z-10 mt-10 transition-opacity duration-300"
        style={{ 
          transform: `translateY(${offset * 0.15}px)`,
          opacity: 1 - (offset / 700)
        }}
      >
        <p className="text-orange-500 font-bold tracking-[0.5em] uppercase text-xs mb-6">AI-Powered Interview Coach</p>
        <h1 className="condensed text-[12vw] lg:text-[13rem]">
          Master The<br />Interview
        </h1>
        <div className="mt-12 max-w-xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] opacity-60 leading-loose">
            Empowering students and job seekers to conquer anxiety and land their dream roles through high-fidelity AI simulations.
          </p>
        </div>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-4 z-20">
        <span className="text-[9px] uppercase tracking-[0.4em] opacity-40">Scroll to Explore</span>
        <div className="w-[1px] h-12 bg-white/20 relative">
          <div className="scroll-line absolute top-0 left-0 w-full h-1/3 bg-orange-500"></div>
        </div>
      </div>
    </section>
  );
};

const About = () => (
  <section id="about" className="py-32 px-10 relative z-10 border-t border-white/10">
    <div className="grid lg:grid-cols-2 gap-20">
      <div>
        <p className="text-orange-500 font-bold tracking-[0.3em] uppercase text-xs mb-6">/ Your Advantage</p>
        <h2 className="condensed text-6xl lg:text-8xl mb-10">Confidence<br />Redefined.</h2>
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-xl text-gray-400 leading-relaxed mb-8">
          VANTAGE AI was built to level the playing field for job seekers. Our platform provides the realistic practice and data-driven insights needed to transform nervous energy into professional poise.
        </p>
        <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-10">
          <div>
            <h4 className="font-bold text-2xl">01. Success</h4>
            <p className="text-sm text-gray-500 mt-2">Users report a 4x increase in offer rates after completing our tailored preparation modules.</p>
          </div>
          <div>
            <h4 className="font-bold text-2xl">02. Growth</h4>
            <p className="text-sm text-gray-500 mt-2">Personalized skill tracking that identifies and bridges your specific communication gaps.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const TechCard = ({ icon, title, description }) => (
  <div className="bg-dark p-12 hover:bg-orange-500 group transition duration-500">
    <div className="text-orange-500 group-hover:text-black mb-6 transition">
      {icon}
    </div>
    <h3 className="text-2xl font-bold group-hover:text-black transition">{title}</h3>
    <p className="mt-4 text-gray-500 group-hover:text-black/70 transition">{description}</p>
  </div>
);

const Technology = () => (
  <section id="ai" className="py-32 bg-[#111] relative z-10 overflow-hidden">
    <div className="absolute right-0 top-0 w-1/3 h-full bg-orange-500/5 blur-[120px]"></div>
    <div className="px-10">
      <h2 className="condensed text-6xl mb-20 text-center">The Neural Engine</h2>
      
      <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
        <TechCard 
          icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>}
          title="Voice Analysis"
          description="Our AI evaluates your tone, pace, and filler word usage to ensure your delivery is authoritative and clear."
        />
        <TechCard 
          icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>}
          title="Cognitive Logic"
          description="Deep analysis of your logic flow and problem-solving approach for technical and behavioral rounds."
        />
        <TechCard 
          icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
          title="Instant Feedback"
          description="Receive a comprehensive performance report with actionable improvement tips immediately after each session."
        />
      </div>
    </div>
  </section>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      className={`faq-item border-b border-white/10 pb-6 cursor-pointer ${isOpen ? 'active' : ''}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between items-center py-4">
        <h3 className="text-xl font-semibold">{question}</h3>
        <span className="faq-icon text-3xl font-light transition">+</span>
      </div>
      <div className="faq-content text-gray-400">
        {answer}
      </div>
    </div>
  );
};

const FAQ = () => (
  <section id="faq" className="py-32 px-10 relative z-10">
    <div className="max-w-4xl mx-auto">
      <h2 className="condensed text-6xl mb-16">Questions</h2>
      <div className="space-y-4">
        <FAQItem 
          question="Can it help with specific technical interviews?"
          answer="Absolutely. VANTAGE AI includes specialized modules for Software Engineering, Data Science, Product Management, and Finance, with domain-specific question banks."
        />
        <FAQItem 
          question="Is my practice data kept private?"
          answer="Yes. Your practice sessions are 100% private. We do not share your recordings or feedback reports with potential employers or third parties."
        />
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-black py-20 px-10 border-t border-white/10 relative z-10">
    <div className="grid md:grid-cols-4 gap-12 mb-20">
      <div className="col-span-2">
        <div className="text-4xl font-bold tracking-tighter mb-6">VANTAGE AI</div>
        <p className="max-w-xs text-gray-500 uppercase text-[10px] tracking-widest leading-loose">
          Empowering the next generation of talent through high-fidelity AI interview simulations. Land your dream role.
        </p>
      </div>
      <div>
        <h4 className="text-orange-500 font-bold text-xs uppercase mb-6 tracking-widest">Connect</h4>
        <ul className="text-gray-400 space-y-3 text-sm">
          <li><a href="#" className="hover:text-white">LinkedIn</a></li>
          <li><a href="#" className="hover:text-white">Twitter / X</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-orange-500 font-bold text-xs uppercase mb-6 tracking-widest">Legal</h4>
        <ul className="text-gray-400 space-y-3 text-sm">
          <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-white">Terms</a></li>
        </ul>
      </div>
    </div>
    <div className="flex justify-between items-center pt-10 border-t border-white/5 text-[10px] text-gray-600 uppercase tracking-widest">
      <p>&copy; 2024 VANTAGE AI SYSTEMS INC.</p>
    </div>
  </footer>
);



function App() {
  const [showLogin, setShowLogin] = useState(false);
  const { currentUser, logout } = useAuth();

  if (currentUser) {
    return (
      <div className="min-h-screen bg-[#0c0c0c]">
        <GridLines />
        <Dashboard user={currentUser} onLogout={logout} />
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-[#0c0c0c]">
        <GridLines />
        <LoginPage onBack={() => setShowLogin(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      <GridLines />
      <Navbar onGetStarted={() => setShowLogin(true)} />
      <Hero />
      <About />
      <Technology />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
