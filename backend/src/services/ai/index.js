import { geminiService } from '../gemini.service.js';
import { ApiError } from '../../utils/apiError.js';

class AiServiceManager {
  async generateQuiz({ topic, difficulty = 'Medium', numQuestions = 4, questionStyle = 'Multiple Choice' }) {
    return geminiService.generateQuiz({
      topic,
      difficulty,
      numberOfQuestions: numQuestions,
      questionStyle
    });
  }

  async getRecommendations({ recentAttempts = [] }) {
    return geminiService.analyzePerformance({ attempts: recentAttempts });
  }
}

export const aiService = new AiServiceManager();

