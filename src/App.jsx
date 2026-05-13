import React, { useState, useEffect } from 'react';

const GridLines = () => (
  <div className="grid-lines">
    <div className="line"></div>
    <div className="line"></div>
    <div className="line"></div>
    <div className="line"></div>
  </div>
);

const Navbar = () => (
  <nav className="fixed w-full z-[100] flex justify-between items-center px-10 py-8 mix-blend-difference">
    <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
      <div className="w-6 h-6 border-2 border-white rotate-45"></div> NEXUS AI
    </div>
    <div className="hidden md:flex gap-10 text-[10px] uppercase tracking-[0.2em] font-semibold">
      <a href="#about" className="hover:text-orange-400 transition">About Us</a>
      <a href="#ai" className="hover:text-orange-400 transition">The Technology</a>
      <a href="#faq" className="hover:text-orange-400 transition">FAQ</a>
    </div>
    <button className="bg-white text-black px-8 py-3 rounded-full text-xs font-bold uppercase hover:bg-orange-500 transition">Get Started</button>
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
        <p className="text-orange-500 font-bold tracking-[0.5em] uppercase text-xs mb-6">Autonomous Intelligence Layer</p>
        <h1 className="condensed text-[12vw] lg:text-[13rem]">
          Intelligence<br />Reimagined
        </h1>
        <div className="mt-12 max-w-xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] opacity-60 leading-loose">
            Empowering the modern enterprise through cognitive synthesis and autonomous neural architecture.
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
        <p className="text-orange-500 font-bold tracking-[0.3em] uppercase text-xs mb-6">/ Our Mission</p>
        <h2 className="condensed text-6xl lg:text-8xl mb-10">Unleashing<br />Potential.</h2>
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-xl text-gray-400 leading-relaxed mb-8">
          NEXUS AI was engineered to bridge the gap between data and action. We provide the cognitive foundation for businesses to scale beyond human limitations, transforming complexity into clarity.
        </p>
        <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-10">
          <div>
            <h4 className="font-bold text-2xl">01. Insight</h4>
            <p className="text-sm text-gray-500 mt-2">Unlocking hidden patterns within your enterprise data with 99.9% processing accuracy.</p>
          </div>
          <div>
            <h4 className="font-bold text-2xl">02. Speed</h4>
            <p className="text-sm text-gray-500 mt-2">Accelerating decision-making cycles from weeks to milliseconds through edge-computing.</p>
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
          icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>}
          title="Neural Synthesis"
          description="Our proprietary LLM architecture synthesizes disparate data streams into actionable business intelligence."
        />
        <TechCard 
          icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>}
          title="Adaptive Learning"
          description="Systems that evolve with your organization, continuously refining their logic based on real-world outcomes."
        />
        <TechCard 
          icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
          title="Autonomous Agents"
          description="Deploy self-managing AI agents that handle complex workflows without constant human oversight."
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
          question="How secure is my data on the platform?"
          answer="We employ enterprise-grade AES-256 encryption and SOC2 Type II compliance standards to ensure your proprietary data remains completely private."
        />
        <FAQItem 
          question="Does it integrate with our existing stack?"
          answer="NEXUS AI features 200+ native integrations including Salesforce, AWS, Slack, and Microsoft Azure, plus a robust REST API."
        />
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-black py-20 px-10 border-t border-white/10 relative z-10">
    <div className="grid md:grid-cols-4 gap-12 mb-20">
      <div className="col-span-2">
        <div className="text-4xl font-bold tracking-tighter mb-6">NEXUS AI</div>
        <p className="max-w-xs text-gray-500 uppercase text-[10px] tracking-widest leading-loose">
          Forging the future of enterprise intelligence through high-fidelity neural architecture. Clarity at scale.
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
      <p>&copy; 2024 NEXUS AI SYSTEMS INC.</p>
    </div>
  </footer>
);

function App() {
  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      <GridLines />
      <Navbar />
      <Hero />
      <About />
      <Technology />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
