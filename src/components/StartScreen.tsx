import React from "react";
import Image from "next/image";

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center animate-fade-in flex flex-col items-center gap-8">
      {/* Logo Container */}
      <div className="relative w-32 h-32 md:w-48 md:h-48 mb-4">
        <div className="absolute inset-0 bg-[#40FFAF]/20 blur-2xl rounded-full animate-pulse" />
        <Image
          src="/logo.jpg"
          alt="Ritualist Logo"
          fill
          className="object-contain relative z-10 drop-shadow-[0_0_15px_rgba(64,255,175,0.5)]"
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic">
          Guess the <span className="text-[#40FFAF]">Ritualist</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-md mx-auto">
          Prove your status. Identify the collective in the blink of an eye.
        </p>
      </div>

      <button
        onClick={onStart}
        className="glow-effect group relative px-12 py-5 bg-[#40FFAF] hover:bg-[#52ffb7] text-black font-black rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden shadow-[0_0_30px_rgba(64,255,175,0.3)]"
      >
        <span className="relative z-10 text-2xl uppercase italic tracking-tighter">Start Session</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="relative z-10 transition-transform group-hover:translate-x-1"
        >
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>

      <div className="grid grid-cols-2 gap-4 mt-8 w-full">
        <div className="glass-morphism p-4 text-sm text-slate-400">
          <span className="block text-white font-semibold mb-1">10 Questions</span>
          Randomized every session
        </div>
        <div className="glass-morphism p-4 text-sm text-slate-400">
          <span className="block text-white font-semibold mb-1">5s Timer</span>
          Fast-paced guessing
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
