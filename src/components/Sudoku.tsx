import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, CheckCircle, Settings } from 'lucide-react';

const INITIAL_GRID = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const Sudoku = () => {
  const [grid, setGrid] = useState(INITIAL_GRID.map((row) => [...row]));
  const [selectedCell, setSelectedCell] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [timer, setTimer] = useState(0);
  const [timeWithPenalties, setTimeWithPenalties] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [cellErrors, setCellErrors] = useState(new Set());
  const [score, setScore] = useState({ time: 0, mistakes: 0, penaltyTime: 0 });

  useEffect(() => {
    let interval;
    if (isRunning && !isComplete) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCellClick = (row, col) => {
    if (INITIAL_GRID[row][col] === 0 && !isComplete) {
      setSelectedCell({ row, col });
      if (!isRunning) setIsRunning(true);
    }
  };

  const handleNumberInput = (number) => {
    if (!selectedCell || isComplete) return;

    const { row, col } = selectedCell;
    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = number;
    setGrid(newGrid);

    if (number !== 0 && !isValidMove(row, col, number)) {
      const errorKey = `${row}-${col}`;
      setCellErrors((prev) => new Set(prev).add(errorKey));
      setTimeWithPenalties((prev) => prev + 60);
      setMistakes((prev) => prev + 1);

      setTimeout(() => {
        setCellErrors((prev) => {
          const newErrors = new Set(prev);
          newErrors.delete(errorKey);
          return newErrors;
        });
      }, 2000);
    }
  };

  const isValidMove = (row, col, num) => {
    for (let x = 0; x < 9; x++) {
      if (x !== col && grid[row][x] === num) return false;
    }

    for (let x = 0; x < 9; x++) {
      if (x !== row && grid[x][col] === num) return false;
    }

    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (blockRow + i !== row || blockCol + j !== col) {
          if (grid[blockRow + i][blockCol + j] === num) return false;
        }
      }
    }

    return true;
  };

  const checkSudoku = () => {
    const isGridComplete = grid.every((row) => row.every((cell) => cell !== 0));
    if (!isGridComplete) {
      alert('Completa tutte le celle prima di verificare!');
      return;
    }

    let isValid = true;
    for (let i = 0; i < 9 && isValid; i++) {
      for (let j = 0; j < 9; j++) {
        if (!isValidMove(i, j, grid[i][j])) {
          isValid = false;
          break;
        }
      }
    }

    if (isValid) {
      setIsComplete(true);
      setIsRunning(false);
      setScore({
        time: timer,
        mistakes: mistakes,
        penaltyTime: timeWithPenalties,
      });
    } else {
      alert('Ci sono degli errori nella griglia. Controlla e riprova!');
    }
  };

  const resetGame = () => {
    setGrid(INITIAL_GRID.map((row) => [...row]));
    setSelectedCell(null);
    setIsComplete(false);
    setTimer(0);
    setTimeWithPenalties(0);
    setIsRunning(false);
    setMistakes(0);
    setCellErrors(new Set());
    setScore({ time: 0, mistakes: 0, penaltyTime: 0 });
  };

  if (showInstructions) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Sudoku</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Come si gioca:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Riempi ogni cella con un numero da 1 a 9</li>
                <li>Ogni riga deve contenere tutti i numeri da 1 a 9</li>
                <li>Ogni colonna deve contenere tutti i numeri da 1 a 9</li>
                <li>Ogni blocco 3x3 deve contenere tutti i numeri da 1 a 9</li>
              </ul>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Inizia
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={resetGame}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Ricomincia"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="font-mono text-lg">
                {formatTime(timer + timeWithPenalties)}
              </span>
              {timeWithPenalties > 0 && (
                <span className="text-red-500 text-sm">
                  (+{Math.floor(timeWithPenalties / 60)}m penalità)
                </span>
              )}
            </div>
            {mistakes > 0 && (
              <span className="text-red-600 font-medium">Errori: {mistakes}</span>
            )}
          </div>
        </div>

        {/* Griglia */}
        <div className="grid grid-cols-9 gap-1 border-4 border-gray-800 mb-6">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                  relative
                  ${rowIndex % 3 === 2 && rowIndex < 8 ? 'border-b-4 border-b-gray-800' : 'border-b border-gray-300'}
                  ${colIndex % 3 === 2 && colIndex < 8 ? 'border-r-4 border-r-gray-800' : 'border-r border-gray-300'}
                `}
              >
                <button
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`
                    absolute 
                    inset-0
                    flex 
                    items-center 
                    justify-center
                    text-lg 
                    font-bold 
                    w-full 
                    h-full
                    transition-all 
                    duration-200
                    ${INITIAL_GRID[rowIndex][colIndex] !== 0
                      ? 'bg-gray-100 text-gray-700 cursor-not-allowed'
                      : 'hover:bg-blue-50 cursor-pointer'}
                    ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                      ? 'bg-blue-100'
                      : ''}
                    ${cellErrors.has(`${rowIndex}-${colIndex}`)
                      ? 'bg-red-100 text-red-600'
                      : ''}
                    ${cell !== 0 && INITIAL_GRID[rowIndex][colIndex] === 0
                      ? 'text-blue-600'
                      : ''}
                  `}
                  disabled={INITIAL_GRID[rowIndex][colIndex] !== 0 || isComplete}
                >
                  {cell !== 0 ? cell : ''}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Verifica e Tastierino */}
        {!isComplete ? (
          <>
            <button
              onClick={checkSudoku}
              className="w-full mb-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
            >
              <CheckCircle className="w-5 h-5" />
              Verifica Soluzione
            </button>

            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
                <button
                  key={number}
                  onClick={() => handleNumberInput(number)}
                  className={`
                    p-4 
                    text-xl 
                    font-bold 
                    rounded-lg 
                    transition-colors 
                    duration-200
                    ${number === 0
                      ? 'bg-red-50 hover:bg-red-100 text-red-600'
                      : 'bg-white hover:bg-gray-50 border'}
                  `}
                  disabled={!selectedCell || isComplete}
                >
                  {number === 0 ? 'X' : number}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-6 bg-blue-50 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              Congratulazioni! Sudoku completato!
            </h3>
            <div className="space-y-2 text-blue-800">
              <p>Tempo: {formatTime(score.time)}</p>
              <p>Penalità: {formatTime(score.penaltyTime)}</p>
              <p>Errori: {score.mistakes}</p>
            </div>
            <button
              onClick={resetGame}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Nuova Partita
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sudoku;
