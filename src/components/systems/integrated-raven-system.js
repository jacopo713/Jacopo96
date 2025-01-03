import RavenMatrixGenerator from './RavenMatrixGenerator';
import CognitiveAnalysisEngine from './CognitiveAnalysisEngine';

class IntegratedRavenSystem {
  constructor() {
    try {
      this.matrixGenerator = new RavenMatrixGenerator();
      this.analysisEngine = new CognitiveAnalysisEngine();
      
      this.currentLevel = 1;
      this.maxLevels = 3;
      this.questionsPerLevel = 7;

      this.testConfiguration = {
        timeLimit: 45000,
        adaptiveDifficulty: true,
        minCorrectToProgress: 0.7,
        minCorrectToRegress: 0.4,
        maxAverageTime: 30000
      };

      console.log('Sistema Raven inizializzato correttamente');
    } catch (error) {
      console.error('Errore durante l\'inizializzazione:', error);
      throw new Error('Inizializzazione del sistema fallita');
    }
  }

  async startTest() {
    try {
      const questions = await this.generateTestQuestions();
      return {
        questions,
        startTime: Date.now(),
        responses: [],
        currentQuestionIndex: 0
      };
    } catch (error) {
      console.error('Errore avvio test:', error);
      throw new Error('Impossibile avviare il test');
    }
  }

  async generateTestQuestions() {
    const questions = [];
    let questionId = 1;

    for (let level = 1; level <= this.maxLevels; level++) {
      for (let i = 0; i < this.questionsPerLevel; i++) {
        try {
          const matrix = await this.matrixGenerator.generateMatrix(level);
          questions.push({
            id: `Q${questionId++}`,
            level,
            matrix,
            timeStarted: null,
            timeEnded: null
          });
        } catch (error) {
          console.error(`Errore generazione matrice L${level}Q${i}:`, error);
          if (level > 1) {
            const fallbackMatrix = await this.matrixGenerator.generateMatrix(level - 1);
            questions.push({
              id: `Q${questionId++}`,
              level: level - 1,
              matrix: fallbackMatrix,
              timeStarted: null,
              timeEnded: null
            });
          }
        }
      }
    }

    return questions.sort(() => Math.random() - 0.5);
  }

  processAnswer(test, questionIndex, answer) {
    if (!test || questionIndex >= test.questions.length) {
      throw new Error('Parametri non validi');
    }

    const question = test.questions[questionIndex];
    const isCorrect = answer === question.matrix.correctAnswer;
    const response = {
      questionId: question.id,
      level: question.level,
      answer,
      isCorrect,
      timeSpent: Date.now() - (question.timeStarted || Date.now())
    };

    if (isCorrect) {
      console.log('Risposta corretta!');
    } else {
      console.log('Risposta errata. La risposta corretta era:', question.matrix.correctAnswer);
    }

    return {
      response,
      shouldContinue: questionIndex + 1 < test.questions.length
    };
  }

  generateFinalReport(test) {
    if (!test || !test.responses) {
      throw new Error('Dati del test non validi');
    }

    const correctAnswers = test.responses.filter(r => r.isCorrect).length;
    const accuracy = correctAnswers / test.responses.length;
    const averageTime = test.responses.reduce((acc, r) => acc + r.timeSpent, 0) / test.responses.length;

    return {
      totalQuestions: test.responses.length,
      correctAnswers,
      accuracy,
      averageTimePerQuestion: averageTime,
      maxLevelReached: Math.max(...test.responses.map(r => r.level)),
      timestamp: Date.now()
    };
  }
}

export default IntegratedRavenSystem;
