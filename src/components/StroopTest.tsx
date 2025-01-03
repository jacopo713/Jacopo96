import React, { useState, useEffect } from 'react';
import { Clock, Brain } from 'lucide-react';

const StroopTest = ({ onComplete }) => {
  // Stati principali
  const [timer, setTimer] = useState(60); // 1 minuto in secondi
  const [currentStimulus, setCurrentStimulus] = useState(null);
  const [responses, setResponses] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const [responseStartTime, setResponseStartTime] = useState(null);

  // Configurazione colori
  const colors = ['rosso', 'blu', 'verde', 'arancione'];
  const colorValues = {
    rosso: '#EF4444',
    blu: '#3B82F6',
    verde: '#10B981',
    arancione: '#F59E0B'
  };

  // Generazione stimolo
  const generateStimulus = (type) => {
    const wordIndex = Math.floor(Math.random() * colors.length);
    const word = colors[wordIndex];
    let colorIndex;
    
    if (type === 'congruent') {
      colorIndex = wordIndex;
    } else {
      do {
        colorIndex = Math.floor(Math.random() * colors.length);
      } while (colorIndex === wordIndex);
    }

    return {
      word,
      color: colors[colorIndex],
      type,
      timestamp: Date.now()
    };
  };

  // Gestione timer e stato del test
  useEffect(() => {
    if (isRunning && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            const finalResults = calculateResults();
            // Usa setTimeout per chiamare onComplete in modo asincrono
            setTimeout(() => {
              if (onComplete) {
                onComplete(finalResults);
              }
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, timer, onComplete]);

  // Inizializzazione stimolo e timing
  useEffect(() => {
    if (isRunning && !currentStimulus) {
      generateNextStimulus();
      setResponseStartTime(Date.now());
    }
  }, [isRunning, currentStimulus]);

  // Generazione nuovo stimolo
  const generateNextStimulus = () => {
    const types = ['congruent', 'incongruent'];
    const type = types[Math.floor(Math.random() * types.length)];
    setCurrentStimulus(generateStimulus(type));
    setResponseStartTime(Date.now());
  };

  // Gestione risposta utente
  const handleResponse = (selectedColor) => {
    if (!currentStimulus || !isRunning) return;

    const response = {
      stimulus: currentStimulus,
      selectedColor,
      correct: selectedColor === currentStimulus.color,
      reactionTime: Date.now() - responseStartTime
    };

    setResponses(prev => [...prev, response]);
    generateNextStimulus();
  };

  // Calcolo risultati finali
  const calculateResults = () => {
    const correct = responses.filter(r => r.correct).length;
    const accuracy = correct / responses.length;
    const avgTime = responses.reduce((acc, r) => acc + r.reactionTime, 0) / responses.length;
    const interferenceScore = responses
      .filter(r => r.stimulus.type === 'incongruent')
      .reduce((acc, r) => acc + r.reactionTime, 0) / 
      responses.filter(r => r.stimulus.type === 'incongruent').length -
      responses
      .filter(r => r.stimulus.type === 'congruent')
      .reduce((acc, r) => acc + r.reactionTime, 0) / 
      responses.filter(r => r.stimulus.type === 'congruent').length;

    return {
      score: Math.round(accuracy * 100),
      accuracy,
      averageReactionTime: avgTime,
      totalResponses: responses.length,
      correctResponses: correct,
      interferenceScore,
      responsesPerMinute: (responses.length / 1).toFixed(1) // 1 minuto totale
    };
  };

  // Formattazione tempo per display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6" />
          <h2 className="text-xl font-bold">Test di Stroop</h2>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="font-mono">{formatTime(timer)}</span>
        </div>
      </div>

      {/* Area di gioco */}
      {currentStimulus && isRunning && (
        <>
          {/* Display parola */}
          <div className="text-center py-12 mb-6">
            <span 
              className="text-4xl font-bold"
              style={{ color: colorValues[currentStimulus.color] }}
            >
              {currentStimulus.word.toUpperCase()}
            </span>
          </div>

          {/* Pulsanti risposta */}
          <div className="grid grid-cols-2 gap-4">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => handleResponse(color)}
                className="p-4 rounded-lg border-2 hover:bg-gray-50 transition-colors"
                style={{ borderColor: colorValues[color] }}
              >
                {color.toUpperCase()}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Statistiche in tempo reale */}
      <div className="mt-6 text-sm text-gray-600">
        Risposte: {responses.length} | 
        Corrette: {responses.filter(r => r.correct).length}
      </div>
    </div>
  );
};

export default StroopTest;
