import React, { useState, useEffect, useRef } from "react";
import { Music } from "lucide-react";

type Note = {
  note: number; // Frequenza in Hz
  duration: number; // Durata in millisecondi
};

// Definizione delle melodie
const melodies: Note[][] = [
  // Livello 1: Melodia semplice, 4 note, durata regolare
  [
    { note: 440, duration: 500 }, // A4
    { note: 523.25, duration: 500 }, // C5
    { note: 659.25, duration: 500 }, // E5
    { note: 783.99, duration: 500 }, // G5
  ],

  // Livello 2: Melodia leggermente più lunga, 6 note
  [
    { note: 440, duration: 400 }, // A4
    { note: 523.25, duration: 400 }, // C5
    { note: 659.25, duration: 400 }, // E5
    { note: 783.99, duration: 400 }, // G5
    { note: 659.25, duration: 400 }, // E5
    { note: 523.25, duration: 400 }, // C5
  ],

  // Livello 3: Introduzione di note più corte
  [
    { note: 440, duration: 300 }, // A4
    { note: 523.25, duration: 150 }, // C5
    { note: 659.25, duration: 300 }, // E5
    { note: 783.99, duration: 150 }, // G5
    { note: 659.25, duration: 300 }, // E5
    { note: 523.25, duration: 150 }, // C5
  ],

  // Livello 4: Aggiunta di pause (note di durata 0)
  [
    { note: 440, duration: 300 }, // A4
    { note: 0, duration: 150 }, // Pausa
    { note: 523.25, duration: 300 }, // C5
    { note: 0, duration: 150 }, // Pausa
    { note: 659.25, duration: 300 }, // E5
    { note: 0, duration: 150 }, // Pausa
    { note: 783.99, duration: 300 }, // G5
  ],

  // Livello 5: Ritmo più complesso con sincopi
  [
    { note: 440, duration: 200 }, // A4
    { note: 523.25, duration: 400 }, // C5
    { note: 440, duration: 200 }, // A4
    { note: 659.25, duration: 400 }, // E5
    { note: 440, duration: 200 }, // A4
    { note: 783.99, duration: 400 }, // G5
  ],

  // Livello 6: Melodia più lunga con variazioni di durata
  [
    { note: 440, duration: 250 }, // A4
    { note: 523.25, duration: 500 }, // C5
    { note: 659.25, duration: 250 }, // E5
    { note: 783.99, duration: 500 }, // G5
    { note: 659.25, duration: 250 }, // E5
    { note: 523.25, duration: 500 }, // C5
    { note: 440, duration: 250 }, // A4
  ],

  // Livello 7: Introduzione di intervalli più ampi
  [
    { note: 440, duration: 300 }, // A4
    { note: 659.25, duration: 300 }, // E5
    { note: 523.25, duration: 300 }, // C5
    { note: 783.99, duration: 300 }, // G5
    { note: 659.25, duration: 300 }, // E5
    { note: 880, duration: 300 }, // A5
  ],

  // Livello 8: Ritmo irregolare con note molto corte e lunghe
  [
    { note: 440, duration: 100 }, // A4
    { note: 523.25, duration: 600 }, // C5
    { note: 659.25, duration: 100 }, // E5
    { note: 783.99, duration: 600 }, // G5
    { note: 659.25, duration: 100 }, // E5
    { note: 523.25, duration: 600 }, // C5
  ],

  // Livello 9: Melodia molto lunga con variazioni complesse
  [
    { note: 440, duration: 200 }, // A4
    { note: 523.25, duration: 300 }, // C5
    { note: 659.25, duration: 200 }, // E5
    { note: 783.99, duration: 300 }, // G5
    { note: 659.25, duration: 200 }, // E5
    { note: 523.25, duration: 300 }, // C5
    { note: 440, duration: 200 }, // A4
    { note: 523.25, duration: 300 }, // C5
    { note: 659.25, duration: 200 }, // E5
    { note: 783.99, duration: 300 }, // G5
  ],

  // Livello 10: Melodia complessa con ritmi irregolari e pause
  [
    { note: 440, duration: 150 }, // A4
    { note: 0, duration: 150 }, // Pausa
    { note: 523.25, duration: 300 }, // C5
    { note: 659.25, duration: 150 }, // E5
    { note: 0, duration: 150 }, // Pausa
    { note: 783.99, duration: 300 }, // G5
    { note: 659.25, duration: 150 }, // E5
    { note: 0, duration: 150 }, // Pausa
    { note: 523.25, duration: 300 }, // C5
    { note: 440, duration: 150 }, // A4
  ],
];

interface RhythmTestProps {
  onComplete: (result: { precision: number; level: number }) => void;
}

const RhythmTest: React.FC<RhythmTestProps> = ({ onComplete }) => {
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<"start" | "listen" | "replay" | "results">(
    "start",
  );
  const [precision, setPrecision] = useState(100);
  const [pulseScale, setPulseScale] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [precisions, setPrecisions] = useState<number[]>([]); // Stato per memorizzare le precisioni
  const masterGainRef = useRef<GainNode | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const currentMelody = melodies[currentLevel] || melodies[0];
  const totalDuration = currentMelody.reduce(
    (acc, { duration }) => acc + duration,
    0,
  );

  const playMelody = async (isDemo = false) => {
    const ctx =
      audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (!audioCtx) setAudioCtx(ctx);
    await ctx.resume();

    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    let startTime = ctx.currentTime;
    currentMelody.forEach(({ note, duration }, index) => {
      if (note === 0) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(note, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, startTime + duration / 1000);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration / 1000);

      setTimeout(() => {
        setPulseScale(1.3);
        setTimeout(() => setPulseScale(1), 100);
      }, index * duration);

      startTime += duration / 1000;
    });

    setIsPlaying(true);
    startTimeRef.current = performance.now();

    if (isDemo) {
      setTimeout(() => {
        if (masterGainRef.current) {
          masterGainRef.current.gain.linearRampToValueAtTime(
            0,
            ctx.currentTime + 0.1,
          );
        }
        setIsPlaying(false);
        setPhase("replay");
      }, totalDuration);
    }
  };

  const startDemo = () => {
    setPhase("listen");
    playMelody(true);
  };

  const stopReplay = () => {
    if (!startTimeRef.current || !audioCtx || !masterGainRef.current) return;

    const duration = performance.now() - startTimeRef.current;
    const deviation = Math.abs(duration - totalDuration);
    const maxDeviation = totalDuration;

    const calculatedPrecision = 100 - (deviation / maxDeviation) * 100;
    const roundedPrecision = Math.round(Math.max(calculatedPrecision, 0));
    const finalPrecision = Math.min(roundedPrecision, 100);

    // Aggiungi la precisione corrente all'array PRIMA di calcolare la media
    setPrecisions((prev) => [...prev, finalPrecision]);

    // Calcola la precisione da visualizzare
    let precisionToDisplay = finalPrecision; // Usa la precisione corrente come default
    if (precisions.length >= 0) {
      // Ora l'array include la precisione corrente
      const sum = [...precisions, finalPrecision].reduce(
        (acc, curr) => acc + curr,
        0,
      );
      precisionToDisplay = sum / (precisions.length + 1); // Calcola la media corretta
    }

    setPrecision(precisionToDisplay); // Imposta la precisione da visualizzare

    masterGainRef.current.gain.linearRampToValueAtTime(
      0,
      audioCtx.currentTime + 0.1,
    );
    setIsPlaying(false);
    setPhase("results");

    if (onComplete) {
      onComplete({ precision: finalPrecision, level: currentLevel });
    }
  };

  const nextLevel = () => {
    if (currentLevel < melodies.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setPhase("start");
      // Non resettare precision a 100, mantieni il valore della media
    } else {
      console.log("Hai completato tutti i livelli!");
    }
  };

  const resetTest = () => {
    setCurrentLevel(0);
    setPhase("start");
    setPrecision(100);
    setPrecisions([]); // Resetta l'array delle precisioni
  };

  useEffect(() => {
    return () => {
      if (audioCtx) {
        audioCtx.close();
      }
    };
  }, [audioCtx]);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Music className="w-8 h-8 text-indigo-600" />
          <h2 className="text-xl font-bold">
            Test del Ritmo - Livello {currentLevel + 1}
          </h2>
        </div>
        <div className="text-lg font-semibold">
          Precisione: {precision.toFixed(2)}% {/* Mostra la precisione media */}
        </div>
      </div>

      <div className="mb-6">
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-200"
            style={{ width: `${precision}%` }}
          />
        </div>
      </div>

      <div className="relative mb-6 w-64 h-64 mx-auto">
        <div
          className={`
            absolute inset-0 border-4 rounded-full 
            transition-all duration-100 ease-out
            ${isPlaying ? "border-yellow-500 bg-yellow-50" : "border-gray-200"}
          `}
          style={{
            transform: `scale(${pulseScale})`,
          }}
        />
      </div>

      <div className="flex justify-center gap-4">
        {phase === "start" && (
          <button
            onClick={startDemo}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium"
          >
            Inizia Test
          </button>
        )}
        {phase === "replay" && !isPlaying && (
          <button
            onClick={() => playMelody(false)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium"
          >
            Riproduci
          </button>
        )}
        {phase === "replay" && isPlaying && (
          <button
            onClick={stopReplay}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium"
          >
            Stop
          </button>
        )}
        {phase === "results" && (
          <>
            <button
              onClick={resetTest}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium"
            >
              Riprova
            </button>
            {currentLevel < melodies.length - 1 && (
              <button
                onClick={nextLevel}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium"
              >
                Prossimo Livello
              </button>
            )}
          </>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        {phase === "listen" && "Ascolta la melodia"}
        {phase === "replay" && !isPlaying && "Riproduci la melodia"}
        {phase === "replay" &&
          isPlaying &&
          "Ferma quando la melodia dovrebbe finire"}
        {phase === "results" && "Test completato!"}
      </div>
    </div>
  );
};

export default RhythmTest;
