import { config } from '../../config/index.js';

/**
 * OpenAI Provider
 * Communicates with OpenAI API (GPT-4o-mini) using JSON mode.
 */
export class OpenAIProvider {
  constructor(apiKey = config.ai.apiKey) {
    this.apiKey = apiKey;
    this.model = 'gpt-4o-mini';
    this.endpoint = 'https://api.openai.com/v1/chat/completions';
  }

  async generateQuiz({ topic, difficulty = 'Medium', numQuestions = 4, questionStyle = 'Multiple Choice' }) {
    if (!this.apiKey || this.apiKey.includes('your_')) {
      throw new Error('OpenAI API key is not configured in backend/.env');
    }

    const systemPrompt = `You are a university computer science educator. Output strict JSON only.`;
    const userPrompt = `
Generate a ${difficulty}-level educational quiz on "${topic}".
Generate exactly ${numQuestions} questions.
Each question MUST have 4 options and a 0-based integer 'correctAnswer' (0, 1, 2, or 3).
Provide an in-depth pedagogical 'explanation'.
JSON format:
{
  "title": "AI: ${topic}",
  "description": "Evaluation on ${topic}.",
  "category": "AI Generated",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "questionText": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "...",
      "topic": "${topic}"
    }
  ]
}
`;

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    return JSON.parse(content);
  }

  async generateRecommendations({ recentAttempts = [] }) {
    if (!this.apiKey || this.apiKey.includes('your_')) return null;

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: 'Suggest 3 technical topics to practice based on performance. Return JSON: {"topics": ["...", "...", "..."]}' },
          { role: 'user', content: 'Analyze recent attempts.' }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);
    return parsed.topics || null;
  }
}
