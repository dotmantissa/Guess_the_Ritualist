import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GameQuestion } from "@/app/page";
import Timer from "./Timer";

interface GameBoardProps {
  questions: GameQuestion[];
  onFinish: (score: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"CORRECT" | "WRONG" | "TIMEOUT" | null>(null);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer: string) => {
    if (selectedAnswer || feedback) return;

    setSelectedAnswer(answer);
    if (answer === currentQuestion.correct) {
      setScore(s => s + 1);
      setFeedback("CORRECT");
    } else {
      setFeedback("WRONG");
    }

    setTimeout(nextQuestion, 1000);
  };

  const handleTimeout = () => {
    if (selectedAnswer || feedback) return;
    setFeedback("TIMEOUT");
    setTimeout(nextQuestion, 1000);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setFeedback(null);
    }
  };

  // Watch for game end
  useEffect(() => {
    if (currentIndex === questions.length - 1 && feedback) {
      const timer = setTimeout(() => {
        onFinish(score);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [feedback, currentIndex, questions.length, score, onFinish]);

  if (!currentQuestion) return null;

  return (
    <div className="animate-fade-in flex flex-col gap-2 w-full max-w-sm mx-auto">
      {/* Header Info */}
      <div className="flex justify-between items-end mb-1">
        <div className="space-y-0.5">
          <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">Progress</p>
          <p className="text-white text-xl font-black italic uppercase tracking-tighter">
            Question <span className="text-[#40FFAF]">{currentIndex + 1}</span>
            <span className="text-slate-600"> / {questions.length}</span>
          </p>
        </div>
      </div>

      <Timer key={currentIndex} duration={5} onTimeUp={handleTimeout} />

      {/* Image Container */}
      <div className="relative aspect-square w-full max-h-[40vh] md:max-h-[45vh] glass-morphism overflow-hidden group shadow-2xl mx-auto">
        <Image
          src={currentQuestion.image}
          alt="Ritualist"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
        
        {/* Feedback Overlay */}
        {feedback && (
          <div className={`absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm transition-opacity duration-200 ${
            feedback === "CORRECT" ? "bg-green-500/20" : "bg-red-500/20"
          }`}>
            <div className="animate-bounce flex flex-col items-center gap-2">
              <span className="text-6xl">
                {feedback === "CORRECT" ? "✅" : feedback === "WRONG" ? "❌" : "⏰"}
              </span>
              <span className="text-white font-bold text-2xl uppercase tracking-widest drop-shadow-lg">
                {feedback === "CORRECT" ? "Correct!" : feedback === "WRONG" ? "Wrong" : "Time's up"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
        {currentQuestion.options.map((name) => (
          <button
            key={name}
            onClick={() => handleAnswer(name)}
            disabled={!!feedback}
            className={`
              py-2.5 px-3 rounded-xl font-black text-base transition-all duration-200 border uppercase italic tracking-tighter
              ${selectedAnswer === name 
                ? (name === currentQuestion.correct ? "bg-[#40FFAF]/20 border-[#40FFAF] text-[#40FFAF]" : "bg-red-500/20 border-red-500 text-red-400")
                : (feedback && name === currentQuestion.correct 
                    ? "bg-[#40FFAF]/20 border-[#40FFAF] text-[#40FFAF]" 
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900 hover:border-[#40FFAF] active:scale-95")
              }
              ${feedback ? "cursor-default" : "cursor-pointer"}
            `}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
