"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount, useConnect, useConnectors, useDisconnect, useSwitchChain } from "wagmi";
import { ritualChain } from "@/lib/wagmi";

interface WalletGateProps {
  onConnected: () => void;
}

const WalletGate: React.FC<WalletGateProps> = ({ onConnected }) => {
  const { address, isConnected, chain } = useAccount();
  const { connect, isPending: isConnecting, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const connectors = useConnectors();

  const [mounted, setMounted] = useState(false);

  // Avoid SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isWrongChain = isConnected && chain?.id !== ritualChain.id;
  const isCorrectChain = isConnected && chain?.id === ritualChain.id;

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const handleConnect = (connector: any) => {
    connect({ connector });
  };

  // Don't render wallet-specific UI until client-side hydration is done
  if (!mounted) return null;

  return (
    <div className="animate-fade-in flex flex-col items-center gap-4 text-center">
      {/* Logo */}
      <div className="relative w-28 h-28 md:w-40 md:h-40">
        <div className="absolute inset-0 bg-[#40FFAF]/20 blur-2xl rounded-full animate-pulse" />
        <Image
          src="/logo.jpg"
          alt="Ritualist Logo"
          fill
          className="object-contain relative z-10 drop-shadow-[0_0_15px_rgba(64,255,175,0.5)]"
          unoptimized
        />
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic">
          Guess the <span className="text-[#40FFAF]">Ritualist</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-sm mx-auto">
          Connect your wallet to prove you belong in the collective.
        </p>
      </div>

      {/* No wallets installed */}
      {!isConnected && connectors.length === 0 && (
        <div className="flex flex-col items-center gap-4">
          <div className="px-5 py-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm font-bold uppercase italic">
            ⚠️ No Web3 Wallet Detected
          </div>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-white/10 border border-white/20 text-white font-black rounded-full transition-all duration-300 hover:scale-105 uppercase italic tracking-tighter text-sm"
          >
            Install a Wallet →
          </a>
        </div>
      )}

      {/* Wallets installed, not connected */}
      {!isConnected && connectors.length > 0 && (
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => handleConnect(connector)}
              disabled={isConnecting}
              className="glow-effect w-full px-6 py-4 bg-[#40FFAF] hover:bg-[#52ffb7] text-black font-black rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(64,255,175,0.3)] uppercase italic tracking-tighter text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Connect {connector.name}
            </button>
          ))}
          
          {isConnecting && <p className="text-[#40FFAF] text-sm mt-2 animate-pulse">Waiting for approval...</p>}
          {connectError && (
            <p className="text-red-400 text-xs max-w-xs bg-red-500/10 p-2 rounded-lg border border-red-500/20 mt-2">
              {connectError.message.includes("rejected") || connectError.message.includes("already pending")
                ? "Connection blocked. Please click your wallet extension icon to approve."
                : connectError.message}
            </p>
          )}
        </div>
      )}

      {/* Wrong chain */}
      {isWrongChain && (
        <div className="flex flex-col items-center gap-4">
          <div className="px-4 py-2 bg-amber-500/10 border border-amber-500 text-amber-400 rounded-xl text-sm font-bold uppercase italic">
            ⚠️ Wrong Network — Switch to Ritual Chain
          </div>
          <button
            onClick={() => switchChain({ chainId: ritualChain.id })}
            disabled={isSwitching}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-full transition-all duration-300 hover:scale-105 active:scale-95 uppercase italic tracking-tighter disabled:opacity-50"
          >
            {isSwitching ? "Switching..." : "Switch to Ritual Chain"}
          </button>
          <button
            onClick={() => disconnect()}
            className="text-slate-500 hover:text-slate-300 text-sm underline transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* Connected + correct chain */}
      {isCorrectChain && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#40FFAF]/10 border border-[#40FFAF]/40 rounded-xl">
            <div className="w-2 h-2 bg-[#40FFAF] rounded-full animate-pulse" />
            <span className="text-[#40FFAF] text-sm font-bold font-mono">{shortAddress}</span>
            <span className="text-slate-500 text-xs">on Ritual Chain</span>
          </div>
          <button
            onClick={onConnected}
            className="glow-effect px-12 py-5 bg-[#40FFAF] hover:bg-[#52ffb7] text-black font-black rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(64,255,175,0.4)] uppercase italic tracking-tighter text-2xl"
          >
            Enter the Game →
          </button>
          <button
            onClick={() => disconnect()}
            className="text-slate-600 hover:text-slate-400 text-xs underline transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletGate;
