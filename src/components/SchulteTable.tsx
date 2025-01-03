import React, { useState, useEffect } from "react";
import { RefreshCw, Clock, Trophy } from "lucide-react";

function SchulteTable() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [size, setSize] = useState(5);
  const [showInstructions, setShowInstructions] = useState(true);

  const generateNumbers = (): number[] => {
    const nums = Array.from({ length: size * size }, (_, i) => i + 1);
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    return nums;
  };

  const startNewGame = () => {
    setNumbers(generateNumbers());
    setCurrentNumber(1);
    setTimer(0);
    setGameStarted(true);
    setShowInstructions(false);
  };

  const handleNumberClick = (number: number) => {
    if (number === currentNumber) {
      if (number === size * size) {
        setGameStarted(false);
        if (!bestTime || timer < bestTime) {
          setBestTime(timer);
        }
      } else {
        setCurrentNumber((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {showInstructions ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Tabella di Schulte</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Come si gioca:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Trova e clicca i numeri in ordine crescente (da 1 a{" "}
                  {size * size})
                </li>
                <li>Cerca di mantenere lo sguardo al centro della griglia</li>
                <li>Usa la visione periferica per trovare i numeri</li>
                <li>
                  Cerca di completare l'esercizio il più velocemente possibile
                </li>
              </ul>
            </div>
            <div>
              <label className="block mb-2">Dimensione griglia:</label>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="p-2 border rounded-lg mr-4"
              >
                <option value={3}>3x3 (Facile)</option>
                <option value={5}>5x5 (Medio)</option>
                <option value={7}>7x7 (Difficile)</option>
              </select>
            </div>
            <button
              onClick={startNewGame}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
            >
              Inizia
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowInstructions(true)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="font-mono text-lg">{formatTime(timer)}</span>
                </div>
              </div>
              {bestTime !== null && (
                <div className="flex items-center text-yellow-600">
                  <Trophy className="w-5 h-5 mr-2" />
                  <span className="font-mono">{formatTime(bestTime)}</span>
                </div>
              )}
            </div>

            <div
              className="grid gap-3 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${size}, 1fr)`,
              }}
            >
              {numbers.map((number, index) => (
                <button
                  key={index}
                  onClick={() => handleNumberClick(number)}
                  className={`
                    w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28
                    flex items-center justify-center
                    text-xl font-bold rounded-lg
                    transition-colors duration-200
                    bg-white hover:bg-gray-100
                    border-2
                    ${
                      number < currentNumber
                        ? "border-green-500 text-green-500"
                        : "border-gray-200"
                    }
                  `}
                >
                  {number}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SchulteTable;
