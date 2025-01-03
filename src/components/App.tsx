import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./HomePage";
import TestIQ from "./TestIQ";
import Sudoku from "./Sudoku";
import SchulteTable from "./SchulteTable";
import StroopTest from "./StroopTest";
import ShortTermMemoryTest from "./ShortTermMemoryTest";
import SpeedReadingTrainer from "./SpeedReadingTrainer";
import RhythmTest from "./RhythmTest";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="iq" element={<TestIQ />} />
          <Route path="sudoku" element={<Sudoku />} />
          <Route path="schulte" element={<SchulteTable />} />
          <Route
            path="stroop"
            element={<StroopTest onComplete={() => {}} />} // Aggiungi onComplete
          />
          <Route
            path="memory"
            element={<ShortTermMemoryTest onComplete={() => {}} />} // Aggiungi onComplete
          />
          <Route
            path="speed-reading"
            element={<SpeedReadingTrainer onComplete={() => {}} />} // Aggiungi onComplete
          />
          <Route
            path="rhythm"
            element={<RhythmTest onComplete={() => {}} />} // Aggiungi onComplete
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
