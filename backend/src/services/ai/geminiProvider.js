import { config } from '../../config/index.js';

/**
 * Google Gemini AI Provider
 * Communicates with Google's Gemini 1.5 API using strict JSON response schemas.
 */
export class GeminiProvider {
  constructor(apiKey = config.ai.apiKey) {
    this.apiKey = apiKey;
    this.model = 'gemini-3.6-flash';
    this.endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
  }

  async generateQuiz({ topic, difficulty = 'Medium', numQuestions = 4, questionStyle = 'Multiple Choice' }) {
    if (!this.apiKey || this.apiKey.includes('your_')) {
      throw new Error('Gemini API key is not configured in backend/.env');
    }

    const systemPrompt = `
You are an expert curriculum developer and technical educator for Quiziverse.
Generate a high-quality, professional educational quiz on the topic: "${topic}".

STRICT CONSTRAINTS:
1. Generate exactly ${numQuestions} questions.
2. Difficulty level: ${difficulty}.
3. Every question MUST have EXACTLY 4 options in an array.
4. Exactly ONE option must be correct.
5. "correctAnswer" MUST be an integer 0, 1, 2, or 3 corresponding to the zero-based index of the correct option.
6. Provide an in-depth, clear, pedagogical "explanation" for why that option is correct and why other concepts might confuse a student.
7. Return ONLY valid JSON matching this exact structure:
{
  "title": "AI: ${topic}",
  "description": "Comprehensive evaluation on ${topic}.",
  "category": "AI Generated",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "questionText": "Question text here?",
      "options": ["Option 0", "Option 1", "Option 2", "Option 3"],
      "correctAnswer": 1,
      "explanation": "Detailed explanation here.",
      "topic": "${topic}"
    }
  ]
}
`;

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('Gemini returned an empty response');
    }

    return JSON.parse(rawText);
  }

  async generateRecommendations({ recentAttempts = [] }) {
    if (!this.apiKey || this.apiKey.includes('your_')) {
      return null;
    }

    const summary = recentAttempts.slice(0, 5).map(a => `${a.quizTitle}: ${a.percentage}% accuracy`).join(', ');
    const prompt = `Based on a student's recent performance (${summary || 'No past quizzes yet'}), suggest 3 targeted technical topics to practice next. Return a JSON array of strings, e.g. ["Topic 1", "Topic 2", "Topic 3"].`;

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, responseMimeType: 'application/json' }
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return rawText ? JSON.parse(rawText) : null;
  }
}
