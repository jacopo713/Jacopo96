// Sistema Ottimizzato di Analisi delle Prestazioni Cognitive
import { mean } from 'lodash';

class CognitiveAnalysisEngine {
  constructor() {
    // Metriche di base ottimizzate
    this.baselineMetrics = {
      // Pesi per categoria di ragionamento
      responseTimeWeights: {
        deduttivo: 1.2,
        induttivo: 1.0,
        spaziale: 1.3,
        analogico: 1.1,
        quantitativo: 1.4,
        astratto: 1.5,
        critico: 1.2,
        sistemico: 1.3
      },
      
      // Tempi di risposta attesi (ms)
      expectedResponseTimes: {
        deduttivo: 45000,
        induttivo: 30000,
        spaziale: 40000,
        analogico: 35000,
        quantitativo: 50000,
        astratto: 45000,
        critico: 60000,
        sistemico: 55000
      },
      
      // Pesi ribilanciati senza consistenza
      evaluationWeights: {
        accuracy: 0.7,    // Aumentato per compensare
        speed: 0.3       // Ribilanciato per completare
      }
    };

    // Parametri QI
    this.iqParams = {
      mean: 100,
      standardDeviation: 15,
      minScore: 40,
      maxScore: 160
    };
  }

  // Analisi prestazioni principale
  analyzePerformance(responses, category) {
    try {
      this.validateInputData(responses);
      
      const accuracy = this.calculateAccuracy(responses.answers, responses.correctAnswers);
      const speedMetrics = this.analyzeResponseTimes(responses.responseTimes, category);
      
      const rawScore = this.calculateRawScore({
        accuracy,
        speedMetrics,
        categoryType: category
      });

      return this.normalizeToIQ(rawScore);
    } catch (error) {
      console.error('Errore analisi prestazioni:', error);
      return this.generateFallbackScore();
    }
  }

  // Validazione input
  validateInputData(responses) {
    if (!responses.answers || !responses.responseTimes || !responses.correctAnswers) {
      throw new Error('Dati di risposta incompleti');
    }
    if (responses.answers.length !== responses.correctAnswers.length) {
      throw new Error('Mancata corrispondenza tra risposte e soluzioni');
    }
  }

  // Calcolo accuratezza
  calculateAccuracy(answers, correctAnswers) {
    if (answers.length === 0) return 0;
    const correctCount = answers.filter((answer, index) => 
      answer === correctAnswers[index]
    ).length;
    return correctCount / answers.length;
  }

  // Analisi tempi di risposta ottimizzata
  analyzeResponseTimes(responseTimes, categoryType) {
    const expectedTime = this.baselineMetrics.expectedResponseTimes[categoryType];
    const avgTime = mean(responseTimes);
    
    // Calcolo speedScore con funzione sigmoidale
    const speedRatio = avgTime / expectedTime;
    const speedScore = 1 / (1 + Math.exp(-(1 - speedRatio)));

    return {
      averageTime: avgTime,
      speedScore: speedScore
    };
  }

  // Calcolo punteggio grezzo ribilanciato
  calculateRawScore({ accuracy, speedMetrics, categoryType }) {
    const weights = this.baselineMetrics.evaluationWeights;
    const categoryWeight = this.baselineMetrics.responseTimeWeights[categoryType];

    const rawScore = (
      Math.pow(accuracy, 1.2) * weights.accuracy +
      speedMetrics.speedScore * weights.speed
    ) * Math.sqrt(categoryWeight);

    return Math.max(0, Math.min(1, rawScore));
  }

  // Normalizzazione QI ottimizzata
  normalizeToIQ(rawScore) {
    const { mean, standardDeviation, minScore, maxScore } = this.iqParams;
    
    // Trasformazione sigmoidale
    const normalized = 1 / (1 + Math.exp(-6 * (rawScore - 0.5)));
    const zScore = (normalized - 0.5) * 2;
    
    const iqScore = Math.round(mean + (zScore * standardDeviation));
    return Math.max(minScore, Math.min(maxScore, iqScore));
  }

  // Generazione report dettagliato
  generateDetailedReport(responses, categoryType) {
    try {
      const performance = this.analyzePerformance(responses, categoryType);
      const speedMetrics = this.analyzeResponseTimes(responses.responseTimes, categoryType);

      return {
        category: categoryType,
        iqScore: performance,
        details: {
          accuracy: this.calculateAccuracy(responses.answers, responses.correctAnswers),
          averageResponseTime: speedMetrics.averageTime,
          speedScore: speedMetrics.speedScore
        },
        interpretation: this.interpretResults(performance)
      };
    } catch (error) {
      console.error('Errore generazione report:', error);
      return this.generateFallbackReport(responses, categoryType);
    }
  }

  // Interpretazione risultati
  interpretResults(iqScore) {
    if (iqScore >= 130) return "Eccezionale";
    if (iqScore >= 120) return "Superiore alla media";
    if (iqScore >= 110) return "Sopra la media";
    if (iqScore >= 90) return "Nella media";
    if (iqScore >= 80) return "Sotto la media";
    return "Necessita miglioramento";
  }

  // Report di fallback
  generateFallbackReport(responses, categoryType) {
    const accuracy = this.calculateAccuracy(responses.answers, responses.correctAnswers);
    return {
      category: categoryType,
      iqScore: 100,
      details: {
        accuracy: accuracy,
        averageResponseTime: mean(responses.responseTimes),
        speedScore: 0.5
      },
      interpretation: 'Nella media'
    };
  }

  // Punteggio di fallback
  generateFallbackScore() {
    return this.iqParams.mean;
  }
}

export default CognitiveAnalysisEngine;
