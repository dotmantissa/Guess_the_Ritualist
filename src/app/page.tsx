"use client"; // Deployment version: 1.0.1

import { useState } from "react";
import WalletGate from "@/components/WalletGate";
import GameBoard from "@/components/GameBoard";
import ResultsScreen from "@/components/ResultsScreen";
import { questions, Question } from "@/data/questions";
import { allNames } from "@/data/names";

export type GameState = "WALLET_GATE" | "PLAYING" | "FINISHED";

export interface GameQuestion extends Question {
  options: string[];
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("WALLET_GATE");
  const [currentQuestions, setCurrentQuestions] = useState<GameQuestion[]>([]);
  const [score, setScore] = useState(0);
  // Keep track of which questions haven't been shown yet
  const [unseenQuestions, setUnseenQuestions] = useState<Question[]>([]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = () => {
    let pool = [...unseenQuestions];
    
    // If we don't have enough questions left for a full round, refill and reshuffle the entire collective
    if (pool.length < 10) {
      pool = shuffleArray(questions);
    }

    // Draw the next 10 questions from the pool
    const selected = pool.slice(0, 10);
    const remaining = pool.slice(10);

    const gameQuestions: GameQuestion[] = selected.map((q) => {
      const otherNames = allNames.filter((n) => n !== q.correct);
      const shuffledWrong = shuffleArray(otherNames);
      const wrongAnswers = shuffledWrong.slice(0, 3);
      const options = shuffleArray([q.correct, ...wrongAnswers]);
      return { ...q, options };
    });

    setCurrentQuestions(gameQuestions);
    setUnseenQuestions(remaining);
    setScore(0);
    setGameState("PLAYING");
  };

  const handleWalletConnected = () => {
    startGame();
  };

  const finishGame = (finalScore: number) => {
    setScore(finalScore);
    setGameState("FINISHED");
  };

  const restartGame = () => {
    setGameState("WALLET_GATE");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:px-24 md:py-4 relative overflow-hidden bg-black text-white">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#40FFAF]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#40FFAF]/5 blur-[120px] rounded-full" />

      <div className="z-10 w-full max-w-2xl">
        {gameState === "WALLET_GATE" && (
          <WalletGate onConnected={handleWalletConnected} />
        )}
        {gameState === "PLAYING" && (
          <GameBoard
            questions={currentQuestions}
            onFinish={finishGame}
          />
        )}
        {gameState === "FINISHED" && (
          <ResultsScreen
            score={score}
            total={10}
            onRestart={restartGame}
          />
        )}
      </div>
    </main>
  );
}
