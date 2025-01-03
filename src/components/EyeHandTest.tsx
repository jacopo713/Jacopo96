import React, { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface Results {
  score: number;
  accuracy: number;
  averageDeviation: number;
}

const EyeHandTest = ({
  onComplete,
}: {
  onComplete: (results: Results) => void;
}) => {
  const [position, setPosition] = useState<Position>({ x: 250, y: 250 });
  const [cursorPos, setCursorPos] = useState<Position>({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [currentPrecision, setCurrentPrecision] = useState(100);
  const [time, setTime] = useState(30);
  const [deviations, setDeviations] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });

    const deviation = Math.sqrt(
      Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2),
    );

    const precision = Math.max(0, Math.min(100, 100 - deviation / 5));
    setCurrentPrecision(precision);

    setDeviations((prev) => [...prev, deviation]);
    setScore((prev) => prev + precision * 0.01);
  };

  const animateTarget = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;

    const elapsed = (timestamp - startTimeRef.current) * 0.0006;
    lastTimeRef.current = timestamp;

    setPosition((prev) => {
      const targetX = 250 + Math.sin(elapsed) * 120;
      const targetY = 250 + Math.cos(elapsed * 0.7) * 120;

      const smoothing = 0.975;

      return {
        x: prev.x + (targetX - prev.x) * (1 - smoothing),
        y: prev.y + (targetY - prev.y) * (1 - smoothing),
      };
    });

    requestRef.current = requestAnimationFrame(animateTarget);
  }, []);

  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => setTime((t) => t - 1), 1000);
      requestRef.current = requestAnimationFrame(animateTarget);

      return () => {
        clearInterval(timer);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
    } else {
      const finalResults = {
        score: Math.round(score),
        accuracy: currentPrecision / 100,
        averageDeviation:
          deviations.reduce((a, b) => a + b, 0) / deviations.length,
      };

      if (onComplete) {
        onComplete(finalResults);
      }
    }
  }, [time, animateTarget, currentPrecision, deviations, onComplete, score]);

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <div className="text-lg font-semibold">
            Precisione Attuale: {Math.round(currentPrecision)}%
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>{time}s</span>
          </div>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-200"
            style={{ width: `${currentPrecision}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Punteggio Totale: {Math.round(score)}
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative bg-white rounded-lg shadow-lg w-[500px] h-[500px] cursor-none mx-auto"
        onMouseMove={handleMouseMove}
      >
        <div
          className="absolute w-8 h-8 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
          style={{
            left: position.x,
            top: position.y,
            filter: "blur(0px)",
            boxShadow: "0 0 20px rgba(239, 68, 68, 0.3)",
          }}
        />
        <div
          className="absolute w-4 h-4 border-2 border-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: cursorPos.x, top: cursorPos.y }}
        >
          <div className="absolute inset-0 m-auto w-1 h-1 bg-blue-500 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default EyeHandTest;
