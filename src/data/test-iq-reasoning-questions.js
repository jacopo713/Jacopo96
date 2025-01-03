// src/data/test-iq-reasoning-questions.js
import RavenMatrixGenerator from "../components/systems/RavenMatrixGenerator";

const ravenGenerator = new RavenMatrixGenerator();

// Funzione per generare domande Raven
const generateRavenQuestions = () => {
  const questions = [];
  const difficulties = [1, 2, 3]; // 1: Facile, 2: Medio, 3: Difficile
  const totalPerDifficulty = 10;

  difficulties.forEach((difficulty, difficultyIndex) => {
    for (let i = 1; i <= totalPerDifficulty; i++) {
      const questionNumber = difficultyIndex * totalPerDifficulty + i;
      questions.push({
        id: `ab${questionNumber}`,
        type: "raven",
        generator: ravenGenerator,
        difficulty: difficulty,
      });
    }
  });

  return questions;
};

export const questionData = {
  deduttivo: {
    name: "Ragionamento Deduttivo",
    questions: [
      // ... Le tue 5 domande deduttive
    ],
  },
  induttivo: {
    name: "Ragionamento Induttivo",
    questions: [
      // ... Le tue 5 domande induttive
    ],
  },
  spaziale: {
    name: "Ragionamento Spaziale",
    questions: [
      // ... Le tue 5 domande spaziali
    ],
  },
  analogico: {
    name: "Ragionamento Analogico",
    questions: [
      // ... Le tue 5 domande analogiche
    ],
  },
  quantitativo: {
    name: "Ragionamento Quantitativo",
    questions: [
      // ... Le tue 5 domande quantitative
    ],
  },
  astratto: {
    name: "Ragionamento Astratto",
    questions: generateRavenQuestions(),
  },
  critico: {
    name: "Pensiero Critico",
    questions: [
      // ... Le tue 3 domande di pensiero critico
    ],
  },
  sistemico: {
    name: "Pensiero Sistemico",
    questions: [
      // ... Le tue 3 domande di pensiero sistemico
    ],
  },
};
