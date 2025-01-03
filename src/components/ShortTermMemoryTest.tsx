import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Clock, Brain, AlertCircle, Award, Undo } from 'lucide-react';

const CONFIG = {
  GRID_SIZE: 16,
  TOTAL_TESTS: 10,
  STEP_DURATION: 800,
  PAUSE_DURATION: 300,
  FEEDBACK_DURATION: 200,
  BASE_SEQUENCE_LENGTH: 3,
  PERCENTILES: [
    { score: 200, percentile: 10 },
    { score: 400, percentile: 25 },
    { score: 600, percentile: 50 },
    { score: 800, percentile: 75 },
    { score: 1000, percentile: 90 },
    { score: 1200, percentile: 95 },
    { score: 1500, percentile: 99 }
  ]
};

const ShortTermMemoryTest = ({ onComplete }) => {
  const timerRef = useRef(null);
  const sequenceRef = useRef(null);
  const gameTimerRef = useRef(null);

  const [gameState, setGameState] = useState({
    isActive: false,
    currentTest: 0,
    score: 0,
    timeElapsed: 0,
    finalResult: null,
    sequenceLength: CONFIG.BASE_SEQUENCE_LENGTH
  });

  const [sequenceState, setSequenceState] = useState({
    sequence: [],
    userSequence: [],
    isPlaying: false,
    activeIndex: null
  });

  const [feedback, setFeedback] = useState({
    message: '',
    type: 'info'
  });

  const calculatePercentile = (score) => {
    for (let i = 0; i < CONFIG.PERCENTILES.length; i++) {
      if (score <= CONFIG.PERCENTILES[i].score) {
        return CONFIG.PERCENTILES[i].percentile;
      }
    }
    return 99;
  };

  const getEvaluation = (percentile) => {
    if (percentile >= 95) return "Eccezionale";
    if (percentile >= 75) return "Sopra la media";
    if (percentile >= 50) return "Nella media";
    if (percentile >= 25) return "Sotto la media";
    return "Necessita pratica";
  };

  const calculateFinalResult = useCallback((score, totalTime) => {
    const averageTimePerTest = totalTime / CONFIG.TOTAL_TESTS;
    const normalizedScore = score * (1 + (30 - Math.min(30, averageTimePerTest)) / 30);
    const percentile = calculatePercentile(normalizedScore);

    return {
      score: Math.round(normalizedScore),
      percentile,
      evaluation: getEvaluation(percentile)
    };
  }, []);

  const generateSequence = useCallback((length) => {
    const sequence = [];
    const used = new Set();

    while (sequence.length < length) {
      const index = Math.floor(Math.random() * CONFIG.GRID_SIZE);
      if (!used.has(index)) {
        sequence.push(index);
        used.add(index);
      }
    }
    return sequence;
  }, []);

  const playSequence = useCallback((sequence) => {
    let step = 0;
    setSequenceState(prev => ({
      ...prev,
      isPlaying: true,
      activeIndex: null
    }));

    const playStep = () => {
      if (step >= sequence.length) {
        setSequenceState(prev => ({
          ...prev,
          isPlaying: false,
          activeIndex: null
        }));
        setFeedback({
          message: 'Riproduci la sequenza!',
          type: 'info'
        });
        return;
      }

      setSequenceState(prev => ({
        ...prev,
        activeIndex: sequence[step]
      }));

      timerRef.current = setTimeout(() => {
        setSequenceState(prev => ({
          ...prev,
          activeIndex: null
        }));

        timerRef.current = setTimeout(() => {
          step++;
          playStep();
        }, CONFIG.PAUSE_DURATION);
      }, CONFIG.STEP_DURATION);
    };

    playStep();
  }, []);

  const handleCellClick = useCallback((index) => {
    if (!gameState.isActive || sequenceState.isPlaying) return;

    setSequenceState(prev => ({
      ...prev,
      activeIndex: index,
      userSequence: [...prev.userSequence, index]
    }));

    setTimeout(() => {
      setSequenceState(prev => ({
        ...prev,
        activeIndex: null
      }));
    }, CONFIG.FEEDBACK_DURATION);
  }, [gameState.isActive, sequenceState.isPlaying]);

  const undoLastClick = useCallback(() => {
    if (sequenceState.userSequence.length > 0) {
      setSequenceState(prev => ({
        ...prev,
        userSequence: prev.userSequence.slice(0, -1)
      }));
    }
  }, [sequenceState.userSequence]);

  const verifySequence = useCallback(() => {
    const isCorrect = sequenceState.sequence.every(
      (val, idx) => val === sequenceState.userSequence[idx]
    );

    if (isCorrect) {
      const nextTest = gameState.currentTest + 1;
      const newSequenceLength = gameState.sequenceLength + 1;

      setGameState(prev => ({
        ...prev,
        score: prev.score + 100,
        currentTest: nextTest,
        sequenceLength: newSequenceLength
      }));

      if (nextTest >= CONFIG.TOTAL_TESTS) {
        const finalResult = calculateFinalResult(gameState.score + 100, gameState.timeElapsed);
        setGameState(prev => ({
          ...prev,
          isActive: false,
          finalResult
        }));
        if (onComplete) {
          onComplete(finalResult);
        }
        setFeedback({
          message: `Test completato! ${finalResult.evaluation}`,
          type: 'success'
        });
      } else {
        const nextSequence = generateSequence(newSequenceLength);
        setSequenceState(prev => ({
          ...prev,
          sequence: nextSequence,
          userSequence: [],
          isPlaying: false
        }));
        setTimeout(() => playSequence(nextSequence), 1000);
      }
    } else {
      const nextTest = gameState.currentTest + 1;

      if (nextTest >= CONFIG.TOTAL_TESTS) {
        const finalResult = calculateFinalResult(gameState.score, gameState.timeElapsed);
        setGameState(prev => ({
          ...prev,
          isActive: false,
          finalResult
        }));
        if (onComplete) {
          onComplete(finalResult);
        }
        setFeedback({
          message: `Test completato! ${finalResult.evaluation}`,
          type: 'info'
        });
      } else {
        const nextSequence = generateSequence(gameState.sequenceLength);
        setSequenceState(prev => ({
          ...prev,
          sequence: nextSequence,
          userSequence: [],
          isPlaying: false
        }));
        setGameState(prev => ({
          ...prev,
          currentTest: nextTest
        }));
        setTimeout(() => playSequence(nextSequence), 1000);
      }
    }
  }, [gameState, sequenceState, generateSequence, playSequence, calculateFinalResult, onComplete]);

  const startTest = useCallback(() => {
    const initialSequence = generateSequence(CONFIG.BASE_SEQUENCE_LENGTH);
    setGameState({
      isActive: true,
      currentTest: 0,
      score: 0,
      timeElapsed: 0,
      finalResult: null,
      sequenceLength: CONFIG.BASE_SEQUENCE_LENGTH
    });
    setSequenceState({
      sequence: initialSequence,
      userSequence: [],
      isPlaying: false,
      activeIndex: null
    });
    setFeedback({
      message: 'Osserva la sequenza...',
      type: 'info'
    });
    setTimeout(() => playSequence(initialSequence), 500);
  }, [generateSequence, playSequence]);

  useEffect(() => {
    if (gameState.isActive) {
      gameTimerRef.current = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1
        }));
      }, 1000);
    }
    return () => clearInterval(gameTimerRef.current);
  }, [gameState.isActive]);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(sequenceRef.current);
      clearInterval(gameTimerRef.current);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold">Test di Memoria</h2>
            <p className="text-sm text-gray-600">
              Test {gameState.currentTest + 1} di {CONFIG.TOTAL_TESTS}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="font-mono">{gameState.timeElapsed}s</span>
        </div>
      </div>

      {feedback.message && (
        <div className={`
          mb-4 p-3 rounded-lg flex items-center gap-2
          ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : ''}
          ${feedback.type === 'error' ? 'bg-red-100 text-red-700' : ''}
          ${feedback.type === 'info' ? 'bg-blue-100 text-blue-700' : ''}
        `}>
          <AlertCircle className="w-5 h-5" />
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 mb-6">
        {Array.from({ length: CONFIG.GRID_SIZE }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={!gameState.isActive || sequenceState.isPlaying}
            className={`
              w-16 h-16 rounded-lg 
              transition-all duration-150 ease-in-out
              ${sequenceState.activeIndex === index 
                ? 'bg-blue-500 scale-95' 
                : !sequenceState.isPlaying && sequenceState.userSequence.includes(index)
                ? 'bg-green-500'
                : 'bg-gray-200 hover:bg-gray-300'
              }
              ${(!gameState.isActive || sequenceState.isPlaying) 
                ? 'cursor-not-allowed opacity-80' 
                : 'cursor-pointer'
              }
              transform active:scale-95
            `}
          />
        ))}
      </div>

      {gameState.finalResult ? (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-blue-900">
              Risultato Finale
            </h3>
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-semibold">Punteggio:</span> {gameState.finalResult.score}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Percentile:</span> {gameState.finalResult.percentile}°
            </p>
            <p className="text-lg">
              <span className="font-semibold">Valutazione:</span> {gameState.finalResult.evaluation}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center gap-4">
          {!gameState.isActive && (
            <button
              onClick={startTest}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition-colors"
            >
              Inizia Test
            </button>
          )}
          {gameState.isActive && !sequenceState.isPlaying && (
            <>
              <button
                onClick={undoLastClick}
                disabled={sequenceState.userSequence.length === 0}
                className={`
                  px-6 py-2 bg-gray-600 text-white rounded-lg 
                  hover:bg-gray-700 transition-colors
                  ${sequenceState.userSequence.length === 0 
                    ? 'cursor-not-allowed opacity-80' 
                    : 'cursor-pointer'
                  }
                `}
              >
                <Undo className="w-5 h-5" />
              </button>
              <button
                onClick={verifySequence}
                disabled={sequenceState.userSequence.length !== sequenceState.sequence.length}
                className={`
                  px-6 py-2 rounded-lg transition-colors
                  ${sequenceState.userSequence.length === sequenceState.sequence.length
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                Verifica Sequenza
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ShortTermMemoryTest;
