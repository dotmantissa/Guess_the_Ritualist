import React, { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

// The ABI for our ScoreRegistry contract
const SCORE_REGISTRY_ABI = [
  {
    "inputs": [{ "internalType": "uint8", "name": "score", "type": "uint8" }],
    "name": "mintScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// IMPORTANT: This is the live contract address on Ritual Chain!
const CONTRACT_ADDRESS = "0x331FD65A78Ae4B11bc6135a75fE2c2AA8724A1B3"; 

interface ResultsScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, total, onRestart }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  
  const { data: hash, writeContract, isPending: isSigning, error: signError } = useWriteContract();
  
  const { isLoading: isMinting, isSuccess: isMinted } = useWaitForTransactionReceipt({
    hash,
  });

  const handleReveal = () => {
    if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      // If not deployed yet, just show it for testing
      setIsRevealed(true);
      return;
    }

    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: SCORE_REGISTRY_ABI,
      functionName: "mintScore",
      args: [score],
    });
  };

  // Automatically reveal when minting is successful
  React.useEffect(() => {
    if (isMinted) {
      setIsRevealed(true);
    }
  }, [isMinted]);

  const getMessage = () => {
    if (score === 10) return { text: "Certified Ritual Insider 🧠🔥", color: "text-[#40FFAF]" };
    if (score >= 8) return { text: "You’re locked in 👀", color: "text-[#40FFAF]/80" };
    if (score >= 5) return { text: "You’re around… kinda 😅", color: "text-slate-400" };
    return { text: "You’re just guessing 😭", color: "text-red-400" };
  };

  const message = getMessage();

  return (
    <div className="text-center animate-fade-in flex flex-col items-center gap-6 py-4 w-full max-w-xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-slate-500 font-bold uppercase tracking-[0.2em] italic text-xs">Session Terminated</h2>
        <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
          {isRevealed ? "Results" : "The Collective Awaits"}
        </h1>
      </div>

      {!isRevealed ? (
        <div className="flex flex-col items-center gap-4 py-4 w-full">
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl w-full text-center space-y-2">
            <p className="text-slate-400 uppercase font-bold italic tracking-widest text-xs">
              Your performance is currently encrypted.
            </p>
            <p className="text-white text-lg font-medium">
              Submit your score to the Ritual Chain to reveal it.
            </p>
          </div>

          <button
            onClick={handleReveal}
            disabled={isSigning || isMinting}
            className="glow-effect px-10 py-4 bg-[#40FFAF] text-black font-black rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(64,255,175,0.4)] uppercase italic tracking-tighter text-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigning ? "Signing..." : isMinting ? "Minting to Chain..." : "Reveal Score"}
          </button>

          {signError && (
            <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
              {signError.message.includes("User rejected") 
                ? "Transaction cancelled. Please try again to reveal." 
                : "Error: " + signError.message}
            </p>
          )}
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in duration-1000 flex flex-col items-center gap-4 w-full">
          <div className="relative">
            <div className="absolute inset-0 bg-[#40FFAF] blur-3xl opacity-20 rounded-full animate-pulse" />
            <div className="relative text-7xl md:text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(64,255,175,0.4)] italic tracking-tighter">
              {score}<span className="text-[#40FFAF]">/</span>{total}
            </div>
          </div>

          <div className={`text-2xl md:text-3xl font-black italic uppercase tracking-tighter ${message.color} animate-pulse`}>
            {message.text}
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onRestart}
              className="px-10 py-3.5 bg-white/5 border border-white/10 text-white font-black rounded-full transition-all duration-300 hover:bg-white/10 hover:scale-105 active:scale-95 italic uppercase tracking-tighter text-lg"
            >
              RE-INITIALIZE
            </button>
            
            {hash && (
              <a
                href={`https://explorer.ritualfoundation.org/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#40FFAF] text-sm uppercase font-bold italic hover:underline underline-offset-4 opacity-70 hover:opacity-100"
              >
                View On-Chain Proof ↗
              </a>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 w-full flex justify-center gap-8">
            <div className="text-center">
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Accuracy</p>
              <p className="text-white text-lg font-bold">{(score / total) * 100}%</p>
            </div>
            <div className="text-center">
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Status</p>
              <p className="text-[#40FFAF] text-lg font-bold uppercase italic">Recorded</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsScreen;
