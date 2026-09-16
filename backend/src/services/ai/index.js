import { config } from '../../config/index.js';
import { GeminiProvider } from './geminiProvider.js';
import { OpenAIProvider } from './openaiProvider.js';
import { MockAiProvider } from './mockAiProvider.js';
import { validateAiQuiz } from './validator.js';

class AiServiceManager {
  constructor() {
    this.provider = this.resolveProvider();
  }

  resolveProvider() {
    const providerName = (config.ai.provider || 'gemini').toLowerCase();
    const apiKey = config.ai.apiKey;

    const hasValidKey = apiKey && !apiKey.includes('your_') && apiKey.length > 10;

    if (providerName === 'gemini' && hasValidKey) {
      console.log('🤖 [AI SERVICE] Initialized with Google Gemini API Provider');
      return new GeminiProvider(apiKey);
    }

    if (providerName === 'openai' && hasValidKey) {
      console.log('🤖 [AI SERVICE] Initialized with OpenAI GPT Provider');
      return new OpenAIProvider(apiKey);
    }

    console.log('🤖 [AI SERVICE] Initialized with High-Fidelity Algorithmic Provider (Dev/Testing Mode)');
    return new MockAiProvider();
  }

  async generateQuiz({ topic, difficulty = 'Medium', numQuestions = 4, questionStyle = 'Multiple Choice' }) {
    // 1. Invoke active AI provider
    const rawQuiz = await this.provider.generateQuiz({
      topic,
      difficulty,
      numQuestions,
      questionStyle
    });

    // 2. Pass through strict single-answer schema validator
    const validatedQuiz = validateAiQuiz(rawQuiz, topic, difficulty);

    return validatedQuiz;
  }

  async getRecommendations({ recentAttempts = [] }) {
    return this.provider.generateRecommendations({ recentAttempts });
  }
}

export const aiService = new AiServiceManager();
