import { geminiService } from '../gemini.service.js';
import { ApiError } from '../../utils/apiError.js';

class AiServiceManager {
  async generateQuiz({ topic, difficulty = 'Medium', numQuestions = 4, questionStyle = 'Multiple Choice' }) {
    if (!geminiService.isKeyConfigured()) {
      throw new ApiError(
        401,
        'Gemini API key is not configured in backend/.env. Please set GEMINI_API_KEY in backend/.env to generate AI quizzes.'
      );
    }
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

