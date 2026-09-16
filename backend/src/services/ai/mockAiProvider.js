/**
 * Mock / Algorithmic AI Provider
 * Provides high-fidelity topic-aware question synthesis when external API keys are unavailable.
 * Ensures the platform remains 100% interactive during development and testing.
 */
export class MockAiProvider {
  async generateQuiz({ topic, difficulty = 'Medium', numQuestions = 4 }) {
    const cleanTopic = topic.trim();
    const count = Math.min(Math.max(1, parseInt(numQuestions, 10) || 4), 50);

    const facetTemplates = [
      {
        q: (prefix) => `${prefix}What is a primary architectural benefit of using ${cleanTopic} in production systems?`,
        correct: `Enhancing scalability, component isolation, and predictable latency characteristics under load.`,
        distractors: [
          `Eliminating all network latency and memory overhead automatically.`,
          `Bypassing CPU execution cycles without thread scheduling.`,
          `Deprecating standard protocol compliance for faster execution.`
        ],
        expl: `Using ${cleanTopic} improves scalability and system isolation while ensuring predictable latency and modularity across microservices.`
      },
      {
        q: (prefix) => `${prefix}When configuring ${cleanTopic} for optimal throughput, which strategy is recommended?`,
        correct: `Implementing asynchronous batching with persistent connection pooling and indexing.`,
        distractors: [
          `Allocating unbounded blocking worker threads per request.`,
          `Disabling synchronization primitives and garbage collection.`,
          `Forcing all client requests through a single synchronous bottleneck.`
        ],
        expl: `Asynchronous batching paired with connection pooling maximizes I/O efficiency and avoids thread starvation.`
      },
      {
        q: (prefix) => `${prefix}Which common anti-pattern should be strictly avoided when implementing ${cleanTopic}?`,
        correct: `Tightly coupling components without clear interface boundaries and omitting timeout safeguards.`,
        distractors: [
          `Logging operational errors and monitoring telemetry metrics.`,
          `Using automated health check probes in container orchestrators.`,
          `Defining declarative schema constraints and input validations.`
        ],
        expl: `Tightly coupling components and omitting timeout safeguards leads to cascading failures across distributed dependencies.`
      },
      {
        q: (prefix) => `${prefix}How does ${cleanTopic} maintain data consistency in high-concurrency environments?`,
        correct: `By leveraging atomic transaction blocks, locks, or optimistic concurrency control mechanisms.`,
        distractors: [
          `By arbitrarily ignoring conflicting writes from concurrent clients.`,
          `By relying solely on volatile client-side localStorage.`,
          `By restarting all worker processes upon concurrent state mutations.`
        ],
        expl: `Atomic transaction semantics (ACID) and optimistic concurrency control ensure that race conditions do not corrupt persistent data.`
      },
      {
        q: (prefix) => `${prefix}What security principle should be prioritized when securing ${cleanTopic}?`,
        correct: `Applying the Principle of Least Privilege and sanitizing all untrusted input vectors.`,
        distractors: [
          `Granting full root administrator access to all service worker tokens.`,
          `Disabling TLS certificate verification on public backbones.`,
          `Storing sensitive credentials in client-side script bundles.`
        ],
        expl: `Enforcing least privilege and strict input sanitization prevents injection vulnerabilities and lateral privilege escalation.`
      },
      {
        q: (prefix) => `${prefix}How should transient failures be handled within ${cleanTopic} integrations?`,
        correct: `Utilizing exponential backoff with jitter and circuit breaker patterns.`,
        distractors: [
          `Repeatedly retrying instantly in a tight synchronous infinite loop.`,
          `Immediately terminating the entire database cluster on first network drop.`,
          `Silently swallowing all runtime exceptions without logging.`
        ],
        expl: `Exponential backoff with jitter prevents thundering herd problem while circuit breakers protect overloaded downstream dependencies.`
      },
      {
        q: (prefix) => `${prefix}Which metric is most critical for monitoring the runtime health of ${cleanTopic}?`,
        correct: `P95/P99 latency percentiles, error rates, and connection saturation.`,
        distractors: [
          `Total lines of commented code in the repository.`,
          `The physical weight of the server rack units.`,
          `Screen brightness settings on client developer monitors.`
        ],
        expl: `P99 latency and saturation metrics provide early detection of tail latency degradations before full system failure.`
      },
      {
        q: (prefix) => `${prefix}How does horizontal partitioning (sharding) improve ${cleanTopic} at scale?`,
        correct: `Distributes data and compute load across independent nodes to surpass single-server hardware limits.`,
        distractors: [
          `Guarantees zero memory allocation across all worker nodes.`,
          `Converts all asynchronous operations into blocking calls.`,
          `Eliminates the need for indexing and caching entirely.`
        ],
        expl: `Horizontal partitioning divides massive datasets across autonomous shards, enabling linear throughput expansion.`
      },
      {
        q: (prefix) => `${prefix}What is an effective strategy for optimizing memory consumption in ${cleanTopic}?`,
        correct: `Streaming data in chunks and releasing object references to allow garbage collection.`,
        distractors: [
          `Buffering the entire multi-gigabyte dataset into heap memory upfront.`,
          `Disabling memory paging and swap partitions in the OS kernel.`,
          `Re-instantiating connection clients on every minor function call.`
        ],
        expl: `Streaming data buffers memory utilization to constant space O(1), preventing out-of-memory crashes.`
      },
      {
        q: (prefix) => `${prefix}What role does automated regression testing play in the lifecycle of ${cleanTopic}?`,
        correct: `Verifies contractual interfaces and prevents breaking changes during continuous integration.`,
        distractors: [
          `Slows down deployments without providing quality guarantees.`,
          `Replaces the need for runtime monitoring and audit trails.`,
          `Guarantees 100% bug-free software in all edge cases automatically.`
        ],
        expl: `Automated test suites catch breaking changes early in CI pipelines, ensuring backward compatibility.`
      }
    ];

    const questions = Array.from({ length: count }, (_, i) => {
      const template = facetTemplates[i % facetTemplates.length];
      const cycle = Math.floor(i / facetTemplates.length) + 1;
      const prefix = count > 10 ? `[Q${i + 1} • Focus ${cycle}] ` : '';

      const correctIdx = (i + cleanTopic.length) % 4;
      const shuffledOptions = [...template.distractors];
      shuffledOptions.splice(correctIdx, 0, template.correct);

      return {
        id: `q-ai-${Date.now()}-${i}`,
        questionText: template.q(prefix),
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
