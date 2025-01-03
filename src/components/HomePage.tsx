import React from 'react';
import { Brain, Grid, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const HomePage = () => {
  const navigate = useNavigate(); // Usa il hook useNavigate

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Allena la Tua Mente</h1>
        <p className="text-lg text-gray-600">
          Scopri la nostra collezione di giochi e test per migliorare le tue capacità mentali
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Test IQ Card */}
        <div
          onClick={() => navigate('/iq')} // Usa navigate invece di onNavigate
          className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <h2 className="text-xl font-semibold ml-2">Test del QI</h2>
          </div>
          <p className="text-gray-600">
            Metti alla prova il tuo quoziente intellettivo con una serie di domande che coprono diverse aree cognitive: logica, spaziale, numerica e altro.
          </p>
        </div>

        {/* Sudoku Card */}
        <div
          onClick={() => navigate('/sudoku')} // Usa navigate invece di onNavigate
          className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center mb-4">
            <Grid className="w-8 h-8 text-green-600" />
            <h2 className="text-xl font-semibold ml-2">Sudoku</h2>
          </div>
          <p className="text-gray-600">
            Affronta il classico puzzle numerico con diversi livelli di difficoltà. Migliora la tua logica e capacità di problem solving.
          </p>
        </div>

        {/* Schulte Table Card */}
        <div
          onClick={() => navigate('/schulte')} // Usa navigate invece di onNavigate
          className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center mb-4">
            <Eye className="w-8 h-8 text-purple-600" />
            <h2 className="text-xl font-semibold ml-2">Tabella di Schulte</h2>
          </div>
          <p className="text-gray-600">
            Migliora la tua velocità di lettura e la percezione visiva periferica. Un esercizio classico per potenziare l'attenzione e la concentrazione.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Perché Allenare la Mente?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Migliora l'Attenzione</h3>
            <p className="text-gray-600">
              Aumenta la tua capacità di concentrazione e la velocità di elaborazione visiva.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Sviluppa il Ragionamento</h3>
            <p className="text-gray-600">
              Potenzia le tue capacità logiche e di problem solving attraverso sfide stimolanti.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Mantieni la Mente Attiva</h3>
            <p className="text-gray-600">
              Esercita regolarmente le tue funzioni cognitive per mantenerle efficienti nel tempo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
