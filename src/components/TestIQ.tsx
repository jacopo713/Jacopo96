import React, { useState } from 'react';
import { Brain, Eye, Activity, Target, Music } from 'lucide-react'; 
import RavenTest from './RavenTest';
import EyeHandTest from './EyeHandTest';
import StroopTest from './StroopTest';
import ShortTermMemoryTest from './ShortTermMemoryTest';
import SpeedReadingTrainer from './SpeedReadingTrainer';
import RhythmTest from './RhythmTest';

const TestIQ = () => {
  const [phase, setPhase] = useState<'intro' | 'raven' | 'coordination' | 'attention' | 'memory' | 'speedReading' | 'rhythm' | 'results'>('intro');
  const [results, setResults] = useState<any>({
    raven: null,
    coordination: null,
    attention: null,
    memory: null,
    speedReading: null,
    rhythm: null,
  });

  const startTesting = () => {
    setPhase('raven');
  };

  const handleRavenComplete = (ravenResults: any) => {
    console.log('Completamento Raven:', ravenResults);
    setResults(prev => ({ ...prev, raven: ravenResults }));
    setPhase('coordination');
  };

  const handleCoordinationComplete = (coordResults: any) => {
    console.log('Completamento Coordinazione:', coordResults);
    setResults(prev => ({ ...prev, coordination: coordResults }));
    setPhase('attention');
  };

  const handleAttentionComplete = (attentionResults: any) => {
    console.log('Completamento Attenzione:', attentionResults);
    setResults(prev => ({ ...prev, attention: attentionResults }));
    setPhase('memory');
  };

  const handleMemoryComplete = (memoryResults: any) => {
    console.log('Completamento Memoria:', memoryResults);
    setResults(prev => ({
      ...prev,
      memory: {
        ...memoryResults,
        score: memoryResults.score || 0,
        accuracy: (memoryResults.percentile || 0) / 100
      }
    }));
    setPhase('speedReading');
  };

  const handleSpeedReadingComplete = (speedReadingResults: any) => {
    console.log('Completamento Lettura Veloce:', speedReadingResults);
    setResults(prev => ({ ...prev, speedReading: speedReadingResults }));
    setPhase('rhythm');
  };

  const handleRhythmComplete = (rhythmResults: any) => {
    console.log('Completamento Ritmo:', rhythmResults);
    setResults(prev => ({ ...prev, rhythm: rhythmResults }));
    setPhase('results');
  };

  const renderIntro = () => (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Valutazione Cognitiva Completa</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Test delle Matrici</h3>
          </div>
          <p className="text-sm text-gray-600">
            Valuta il ragionamento astratto e l'intelligenza fluida
          </p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold">Coordinazione Occhio-Mano</h3>
          </div>
          <p className="text-sm text-gray-600">
            Misura la precisione e velocità dei movimenti
          </p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">Attenzione Selettiva</h3>
          </div>
          <p className="text-sm text-gray-600">
            Valuta la capacità di focalizzare l'attenzione
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold">Memoria a Breve Termine</h3>
          </div>
          <p className="text-sm text-gray-600">
            Misura la capacità di memorizzare sequenze
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold">Lettura Veloce</h3>
          </div>
          <p className="text-sm text-gray-600">
            Misura la velocità e la precisione di lettura
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Music className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold">Test del Ritmo</h3>
          </div>
          <p className="text-sm text-gray-600">
            Valuta la capacità di percepire e riprodurre il ritmo
          </p>
        </div>
      </div>

      <button
        onClick={startTesting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        Inizia Valutazione
      </button>
    </div>
  );

  const renderResults = () => (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Report Cognitivo Completo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Raven */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Ragionamento Astratto</h3>
          <div className="text-3xl font-bold text-blue-600">
            {results.raven?.score ?? 0}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(results.raven?.accuracy ?? 0) * 100}%` }}
            />
          </div>
        </div>

        {/* Coordinazione */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Coordinazione</h3>
          <div className="text-3xl font-bold text-green-600">
            {results.coordination?.score ?? 0}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(results.coordination?.accuracy ?? 0) * 100}%` }}
            />
          </div>
        </div>

        {/* Attenzione */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Attenzione Selettiva</h3>
          <div className="text-3xl font-bold text-purple-600">
            {results.attention?.score ?? 0}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(results.attention?.accuracy ?? 0) * 100}%` }}
            />
          </div>
        </div>

        {/* Memoria */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Memoria a Breve Termine</h3>
          <div className="text-3xl font-bold text-yellow-600">
            {results.memory?.score ?? 0}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(results.memory?.accuracy ?? 0) * 100}%` }}
            />
          </div>
        </div>

        {/* Lettura Veloce */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Lettura Veloce</h3>
          <div className="text-3xl font-bold text-red-600">
            {results.speedReading?.wpm ?? 0} WPM
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(results.speedReading?.wpm ?? 0) / 10}%` }}
            />
          </div>
        </div>

        {/* Ritmo */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Ritmo</h3>
          <div className="text-3xl font-bold text-indigo-600">
            {results.rhythm?.precision ?? 0}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${results.rhythm?.precision ?? 0}%` }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        Ripeti Valutazione
      </button>
    </div>
  );

  const renderCurrentPhase = () => {
    switch (phase) {
      case 'intro':
        return renderIntro();
      case 'raven':
        return <RavenTest onComplete={handleRavenComplete} />;
      case 'coordination':
        return <EyeHandTest onComplete={handleCoordinationComplete} />;
      case 'attention':
        return <StroopTest onComplete={handleAttentionComplete} />;
      case 'memory':
        return <ShortTermMemoryTest onComplete={handleMemoryComplete} />;
      case 'speedReading':
        return <SpeedReadingTrainer onComplete={handleSpeedReadingComplete} />;
      case 'rhythm':
        return <RhythmTest onComplete={handleRhythmComplete} />;
      case 'results':
        return renderResults();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {renderCurrentPhase()}
      {/* Fase Debug */}
      <div className="fixed bottom-0 right-0 bg-black text-white p-2 text-xs">
        Fase: {phase}
      </div>
    </div>
  );
};

export default TestIQ;

