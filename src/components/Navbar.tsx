import React, { useState, useRef } from "react";
import { Brain, Home, Puzzle, Eye, Clock, Table, Music } from "lucide-react"; // Importa Music
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isRompicapiOpen, setIsRompicapiOpen] = useState(false);
  const [isAttenzioneOpen, setIsAttenzioneOpen] = useState(false);
  const [isMemoriaOpen, setIsMemoriaOpen] = useState(false);

  const rompicapiTimeoutRef = useRef(null);
  const attenzioneTimeoutRef = useRef(null);
  const memoriaTimeoutRef = useRef(null);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                Turing
              </span>
            </div>

            {/* Menu principale */}
            <div className="ml-10 flex items-center space-x-4">
              {/* Pulsante Home */}
              <Link
                to="/"
                className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center"
              >
                <Home className="w-5 h-5 mr-2" /> {/* Icona Home */}
                Home
              </Link>

              {/* Sezione Test IQ */}
              <Link
                to="/iq"
                className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center"
              >
                <Brain className="w-5 h-5 mr-2" /> {/* Icona Brain */}
                Test IQ
              </Link>

              {/* Sezione Rompicapi */}
              <div
                className="relative inline-block"
                onMouseEnter={() => {
                  if (rompicapiTimeoutRef.current)
                    clearTimeout(rompicapiTimeoutRef.current);
                  setIsRompicapiOpen(true);
                }}
                onMouseLeave={() => {
                  rompicapiTimeoutRef.current = setTimeout(
                    () => setIsRompicapiOpen(false),
                    200,
                  );
                }}
              >
                <button className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center">
                  <Puzzle className="w-5 h-5 mr-2" /> {/* Icona Puzzle */}
                  Rompicapi
                </button>
                {isRompicapiOpen && (
                  <div
                    className="absolute bg-white shadow-lg rounded-md mt-2 min-w-[160px] border border-gray-100"
                    onMouseEnter={() => {
                      if (rompicapiTimeoutRef.current)
                        clearTimeout(rompicapiTimeoutRef.current);
                    }}
                    onMouseLeave={() => {
                      rompicapiTimeoutRef.current = setTimeout(
                        () => setIsRompicapiOpen(false),
                        200,
                      );
                    }}
                  >
                    <Link
                      to="/sudoku"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left transition-colors duration-200 flex items-center"
                    >
                      <Puzzle className="w-5 h-5 mr-2" /> {/* Icona Puzzle */}
                      Sudoku
                    </Link>
                  </div>
                )}
              </div>

              {/* Sezione Attenzione */}
              <div
                className="relative inline-block"
                onMouseEnter={() => {
                  if (attenzioneTimeoutRef.current)
                    clearTimeout(attenzioneTimeoutRef.current);
                  setIsAttenzioneOpen(true);
                }}
                onMouseLeave={() => {
                  attenzioneTimeoutRef.current = setTimeout(
                    () => setIsAttenzioneOpen(false),
                    200,
                  );
                }}
              >
                <button className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center">
                  <Eye className="w-5 h-5 mr-2" /> {/* Icona Eye */}
                  Attenzione
                </button>
                {isAttenzioneOpen && (
                  <div
                    className="absolute bg-white shadow-lg rounded-md mt-2 min-w-[160px] border border-gray-100"
                    onMouseEnter={() => {
                      if (attenzioneTimeoutRef.current)
                        clearTimeout(attenzioneTimeoutRef.current);
                    }}
                    onMouseLeave={() => {
                      attenzioneTimeoutRef.current = setTimeout(
                        () => setIsAttenzioneOpen(false),
                        200,
                      );
                    }}
                  >
                    <Link
                      to="/schulte"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left transition-colors duration-200 flex items-center"
                    >
                      <Table className="w-5 h-5 mr-2" /> {/* Icona Table */}
                      Tabella di Schulte
                    </Link>
                    <Link
                      to="/stroop"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left transition-colors duration-200 flex items-center"
                    >
                      <Eye className="w-5 h-5 mr-2" /> {/* Icona Eye */}
                      Test Stroop
                    </Link>
                    <Link
                      to="/speed-reading"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left transition-colors duration-200 flex items-center"
                    >
                      <Eye className="w-5 h-5 mr-2" /> {/* Icona Eye */}
                      Allenamento Velocità di Lettura
                    </Link>
                    <Link
                      to="/rhythm"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left transition-colors duration-200 flex items-center"
                    >
                      <Music className="w-5 h-5 mr-2" /> {/* Icona Music */}
                      Test del Ritmo
                    </Link>
                  </div>
                )}
              </div>

              {/* Sezione Memoria */}
              <div
                className="relative inline-block"
                onMouseEnter={() => {
                  if (memoriaTimeoutRef.current)
                    clearTimeout(memoriaTimeoutRef.current);
                  setIsMemoriaOpen(true);
                }}
                onMouseLeave={() => {
                  memoriaTimeoutRef.current = setTimeout(
                    () => setIsMemoriaOpen(false),
                    200,
                  );
                }}
              >
                <button className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center">
                  <Clock className="w-5 h-5 mr-2" /> {/* Icona Clock */}
                  Memoria
                </button>
                {isMemoriaOpen && (
                  <div
                    className="absolute bg-white shadow-lg rounded-md mt-2 min-w-[160px] border border-gray-100"
                    onMouseEnter={() => {
                      if (memoriaTimeoutRef.current)
                        clearTimeout(memoriaTimeoutRef.current);
                    }}
                    onMouseLeave={() => {
                      memoriaTimeoutRef.current = setTimeout(
                        () => setIsMemoriaOpen(false),
                        200,
                      );
                    }}
                  >
                    <Link
                      to="/memory"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left transition-colors duration-200 flex items-center"
                    >
                      <Clock className="w-5 h-5 mr-2" /> {/* Icona Clock */}
                      Memoria a Breve Termine
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
