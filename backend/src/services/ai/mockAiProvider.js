/**
 * Mock / Algorithmic AI Provider
 * Provides high-fidelity topic-aware question synthesis when external API keys are unavailable.
 * Ensures the platform remains 100% interactive during development and testing.
 */
export class MockAiProvider {
  async generateQuiz({ topic, difficulty = 'Medium', numQuestions = 4 }) {
    const cleanTopic = topic.trim();
    const count = Math.min(Math.max(2, parseInt(numQuestions, 10) || 4), 10);

    const questions = Array.from({ length: count }, (_, i) => {
      const concepts = [
        {
          q: `What is a primary architectural benefit of using ${cleanTopic} in production systems?`,
          correct: `Enhancing scalability, isolation, and predictable performance characteristics under load.`,
          distractors: [
            `Eliminating all network latency and memory overhead automatically.`,
            `Bypassing CPU execution cycles without thread scheduling.`,
            `Deprecating standard protocol compliance for faster execution.`
          ],
          expl: `Using ${cleanTopic} improves scalability and system isolation while ensuring predictable latency and modularity across microservices.`
        },
        {
          q: `When configuring ${cleanTopic} for optimal throughput, which strategy is recommended?`,
          correct: `Implementing asynchronous batching with persistent connection pooling and indexing.`,
          distractors: [
            `Allocating unbounded blocking worker threads per request.`,
            `Disabling synchronization primitives and garbage collection.`,
            `Forcing all client requests through a single synchronous bottleneck.`
          ],
          expl: `Asynchronous batching paired with connection pooling maximizes I/O efficiency and avoids thread starvation.`
        },
        {
          q: `Which common anti-pattern should be avoided when implementing ${cleanTopic}?`,
          correct: `Tightly coupling components without clear interface boundaries and failing to set timeout limits.`,
          distractors: [
            `Logging operational errors and monitoring telemetry metrics.`,
            `Using automated health check probes in container orchestrators.`,
            `Defining declarative schema constraints and input validations.`
          ],
          expl: `Tightly coupling components and omitting timeout safeguards leads to cascading failures across distributed dependencies.`
        },
        {
          q: `How does ${cleanTopic} maintain state consistency in concurrent environments?`,
          correct: `By leveraging atomic transaction blocks, locks, or optimistic concurrency control mechanisms.`,
          distractors: [
            `By arbitrarily ignoring conflicting writes from concurrent clients.`,
            `By relying solely on volatile client-side localStorage.`,
            `By restarting all worker processes upon concurrent state mutations.`
          ],
          expl: `Atomic transaction semantics (ACID) and optimistic concurrency control ensure that race conditions do not corrupt persistent data.`
        }
      ];

      const template = concepts[i % concepts.length];
      const allOptions = [template.correct, ...template.distractors];

      // Pseudo-random deterministic placement of the correct answer
      const correctIdx = (i + cleanTopic.length) % 4;
      const shuffledOptions = [...template.distractors];
      shuffledOptions.splice(correctIdx, 0, template.correct);

      return {
        questionText: template.q,
        options: shuffledOptions,
        correctAnswer: correctIdx,
        explanation: template.expl,
        topic: cleanTopic
      };
    });

    return {
      title: `AI: ${cleanTopic}`,
      description: `AI-synthesized assessment testing ${difficulty}-level proficiency on ${cleanTopic}.`,
      category: "AI Generated",
      difficulty,
      questions
    };
  }

  async generateRecommendations({ recentAttempts = [] }) {
    if (!recentAttempts.length) {
      return ["Web Development Fundamentals", "Python Data Structures", "Cloud Docker Containers"];
    }

    // Identify lowest-scoring attempt
    const sorted = [...recentAttempts].sort((a, b) => a.percentage - b.percentage);
    const lowest = sorted[0];

    return [
      `Deep Dive: ${lowest.quizTitle} Advanced Concepts`,
      `Practical Applications of ${lowest.quizTitle}`,
      "System Design & High Concurrency"
    ];
  }
}
