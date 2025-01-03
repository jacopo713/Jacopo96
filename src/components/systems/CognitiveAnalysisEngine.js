class CognitiveAnalysisEngine {
  constructor() {
    this.metrics = {
      responseTimeWeights: {
        deduttivo: 1.2,
        induttivo: 1.0,
        spaziale: 1.3,
        analogico: 1.1,
        quantitativo: 1.4,
        astratto: 1.5,
        critico: 1.2,
        sistemico: 1.3,
        raven: 1.6
      },
      expectedResponseTimes: {
        deduttivo: 45000,
        induttivo: 30000,
        spaziale: 40000,
        analogico: 35000,
        quantitativo: 50000,
        astratto: 45000,
        critico: 60000,
        sistemico: 55000,
        raven: 40000
      },
      evaluationWeights: {
        accuracy: 0.7,
        speed: 0.3
      }
    };

    this.iqParams = {
      mean: 100,
      standardDeviation: 15,
      minScore: 40,
      maxScore: 160
    };
  }

  analyzePerformance(responses, category) {
    const accuracy = this.calculateAccuracy(responses.answers, responses.correctAnswers);
    const speedScore = this.analyzeSpeed(responses.responseTimes, category);
    const rawScore = this.calculateRawScore(accuracy, speedScore, category);
    return this.normalizeToIQ(rawScore);
  }

  calculateAccuracy(answers, correctAnswers) {
    if (!answers.length) return 0;
    const correct = answers.filter((a, i) => a === correctAnswers[i]).length;
    return correct / answers.length;
  }

  analyzeSpeed(responseTimes, category) {
    const expectedTime = this.metrics.expectedResponseTimes[category];
    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const speedRatio = avgTime / expectedTime;
    return 1 / (1 + Math.exp(-(1 - speedRatio)));
  }

  calculateRawScore(accuracy, speedScore, category) {
    const weights = this.metrics.evaluationWeights;
    const categoryWeight = this.metrics.responseTimeWeights[category];
    
    const weightedScore = (
      Math.pow(accuracy, 1.2) * weights.accuracy +
      speedScore * weights.speed
    ) * Math.sqrt(categoryWeight);

    return Math.max(0, Math.min(1, weightedScore));
  }

  normalizeToIQ(rawScore) {
    const { mean, standardDeviation, minScore, maxScore } = this.iqParams;
    const normalized = 1 / (1 + Math.exp(-6 * (rawScore - 0.5)));
    const zScore = (normalized - 0.5) * 2;
    const iqScore = Math.round(mean + (zScore * standardDeviation));
    return Math.max(minScore, Math.min(maxScore, iqScore));
  }

  generateDetailedReport(responses, category) {
    try {
      const performance = this.analyzePerformance(responses, category);
      const speedMetrics = this.analyzeSpeed(responses.responseTimes, category);

      return {
        category,
        iqScore: performance,
        details: {
          accuracy: this.calculateAccuracy(responses.answers, responses.correctAnswers),
          averageResponseTime: responses.responseTimes.reduce((a, b) => a + b, 0) / responses.responseTimes.length,
          speedScore: speedMetrics
        },
        interpretation: this.interpretResults(performance)
      };
    } catch (error) {
      console.error('Errore report:', error);
      return this.generateFallbackReport(responses, category);
    }
  }

  interpretResults(iqScore) {
    if (iqScore >= 130) return "Eccezionale";
    if (iqScore >= 120) return "Superiore alla media";
    if (iqScore >= 110) return "Sopra la media";
    if (iqScore >= 90) return "Nella media";
    if (iqScore >= 80) return "Sotto la media";
    return "Necessita miglioramento";
  }

  generateFallbackReport(responses, category) {
    const accuracy = this.calculateAccuracy(responses.answers, responses.correctAnswers);
    return {
      category,
      iqScore: 100,
      details: {
        accuracy,
        averageResponseTime: responses.responseTimes.reduce((a, b) => a + b, 0) / responses.responseTimes.length,
        speedScore: 0.5
      },
      interpretation: 'Nella media'
    };
  }
}

export default CognitiveAnalysisEngine;
