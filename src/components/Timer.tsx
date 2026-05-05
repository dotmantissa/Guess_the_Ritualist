import React, { useEffect, useState } from "react";

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 0.05));
    }, 50);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-75 ease-linear ${
          percentage < 30 ? "bg-red-500" : "bg-[#40FFAF]"
        }`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default Timer;
