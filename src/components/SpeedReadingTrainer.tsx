import React, { useState, useEffect } from "react";

const SpeedReadingTrainer = ({ onComplete }) => {
  const [words] = useState([
    "casa",
    "libro",
    "sole",
    "mare",
    "albero",
    "gatto",
    "cane",
    "tavolo",
    "sedia",
    "finestra",
    "porta",
    "cielo",
    "terra",
    "fiore",
    "montagna",
    "fiume",
    "lago",
    "stella",
    "luna",
    "vento",
  ]);
  const [currentWord, setCurrentWord] = useState("");
  const [currentPosition, setCurrentPosition] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [lastWord, setLastWord] = useState("");
  const [options, setOptions] = useState([]);
  const [result, setResult] = useState("");
  const [cycleCount, setCycleCount] = useState(0);
  const [isAsking, setIsAsking] = useState(false);
  const [wpm, setWpm] = useState(50);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);

  const generateOptions = (correctWord) => {
    const opts = [correctWord];
    while (opts.length < 4) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      if (!opts.includes(randomWord)) {
        opts.push(randomWord);
      }
    }
    return opts.sort(() => Math.random() - 0.5);
  };

  const generateRandomPosition = () => {
    return Math.floor(Math.random() * 9);
  };

  const getRandomTime = () => {
    const msPerWord = (60 * 1000) / wpm;
    const variation = msPerWord * 0.1;
    return msPerWord + (Math.random() * variation * 2 - variation);
  };

  useEffect(() => {
    let timeout;

    const showNextWord = () => {
      if (!isRunning || isAsking) return;

      const randomWord = words[Math.floor(Math.random() * words.length)];
      const randomPosition = generateRandomPosition();

      setCurrentWord(randomWord);
      setCurrentPosition(randomPosition);
      setLastWord(randomWord);

      timeout = setTimeout(() => {
        setCurrentPosition(-1);

        timeout = setTimeout(() => {
          if (cycleCount < 20) {
            if (Math.random() > 0.3) {
              showNextWord();
            } else {
              setIsAsking(true);
              setOptions(generateOptions(randomWord));
            }
          } else {
            setIsRunning(false);
          }
        }, getRandomTime() * 0.3);
      }, getRandomTime());
    };

    if (isRunning && !isAsking) {
      showNextWord();
    }

    return () => clearTimeout(timeout);
  }, [isRunning, isAsking, cycleCount, words, wpm]);

  useEffect(() => {
    if (cycleCount >= 20) {
      const finalResults = {
        wpm,
        accuracy: correctAnswers / totalAnswers || 0,
        score: Math.round(wpm * (correctAnswers / totalAnswers || 0)),
      };
      if (onComplete) {
        onComplete(finalResults);
      }
    }
  }, [cycleCount, wpm, correctAnswers, totalAnswers, onComplete]);

  const handleOptionClick = (selectedWord) => {
    setTotalAnswers((prev) => prev + 1);
    if (selectedWord === lastWord) {
      setResult("Corretto! 🎉");
      setWpm((prev) => Math.min(1000, prev + 50));
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setResult(`Sbagliato. La parola era: ${lastWord}`);
      setWpm((prev) => Math.max(50, prev - 50));
    }
    setIsAsking(false);
    setCycleCount((prev) => prev + 1);
  };

  const startTraining = () => {
    setIsRunning(true);
    setCycleCount(0);
    setCurrentWord("");
    setLastWord("");
    setResult("");
    setIsAsking(false);
    setCurrentPosition(-1);
    setWpm(50);
    setCorrectAnswers(0);
    setTotalAnswers(0);
  };

  const getSpeedLevel = () => {
    if (wpm < 250) return "Velocità base";
    if (wpm < 400) return "Lettura veloce";
    if (wpm < 700) return "Lettura avanzata";
    return "Lettura esperta";
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Allenamento Lettura Veloce
      </h1>

      <div className="grid grid-cols-3 gap-1 mb-8">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className={`
              aspect-square border text-center
              flex items-center justify-center
              transition-all duration-100 ease-in-out
              ${
                currentPosition === index
                  ? "bg-blue-50 border-blue-400"
                  : "bg-gray-50 border-gray-200"
              }
              ${index === currentPosition ? "scale-105" : "scale-100"}
            `}
          >
            <span
              className={`
              text-xl font-medium
              transition-opacity duration-100
              ${currentPosition === index ? "opacity-100" : "opacity-0"}
            `}
            >
              {currentPosition === index ? currentWord : ""}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="font-medium text-gray-700">
            Velocità attuale:{" "}
            <span className="text-blue-600 font-bold">{wpm} WPM</span>
          </div>
          <div className="text-sm text-gray-500">{getSpeedLevel()}</div>
        </div>

        {isAsking && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3 text-center">
              Quale parola hai visto per ultima?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {options.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(word)}
                  className="p-3 bg-white rounded-lg hover:bg-blue-50 
                           border border-gray-200 transition-colors
                           font-medium text-gray-700"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div
            className={`
            text-center p-3 rounded-lg font-medium
            ${result.includes("Corretto") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
          `}
          >
            {result}
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={startTraining}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 transition-colors font-medium"
          >
            {isRunning ? "Ricomincia" : "Inizia"}
          </button>
          {isRunning && (
            <button
              onClick={() => setIsRunning(false)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg
                       hover:bg-red-700 transition-colors font-medium"
            >
              Ferma
            </button>
          )}
        </div>

        <div className="text-center font-medium text-gray-700">
          Cicli completati: {cycleCount} / 20
        </div>
      </div>
    </div>
  );
};

export default SpeedReadingTrainer;
