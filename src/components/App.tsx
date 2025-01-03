import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import HomePage from './HomePage';
import TestIQ from './TestIQ';
import Sudoku from './Sudoku';
import SchulteTable from './SchulteTable';
import StroopTest from './StroopTest';
import ShortTermMemoryTest from './ShortTermMemoryTest';
import SpeedReadingTrainer from './SpeedReadingTrainer'; // Importa il componente
import RhythmTest from './RhythmTest'; // Importa il componente RhythmTest

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="iq" element={<TestIQ />} />
          <Route path="sudoku" element={<Sudoku />} />
          <Route path="schulte" element={<SchulteTable />} />
          <Route path="stroop" element={<StroopTest />} />
          <Route path="memory" element={<ShortTermMemoryTest />} />
          <Route path="speed-reading" element={<SpeedReadingTrainer />} /> {/* Aggiungi la rotta */}
          <Route path="rhythm" element={<RhythmTest />} /> {/* Aggiungi la rotta per RhythmTest */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
