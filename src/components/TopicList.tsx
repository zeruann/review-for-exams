import type { Subject } from "../types/quiz";

export const ALL_TOPICS = "__all__";

/**
 * Reads the `topic` field of a question. Questions without a topic fall
 * into "Other" so no question is ever left out of "All topics".
 */
export function getTopic(question: unknown): string {
  const t = (question as { topic?: string }).topic;
  return t && t.trim() ? t.trim() : "Other";
}

/** Distinct topics in order of first appearance, with question counts. */
export function getTopics(subject: Subject): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const q of subject.questions) {
    const topic = getTopic(q);
    counts.set(topic, (counts.get(topic) ?? 0) + 1);
  }
  return Array.from(counts, ([name, count]) => ({ name, count }));
}

/** Returns a copy of the subject limited to one topic (or everything). */
export function filterSubjectByTopic(subject: Subject, topic: string): Subject {
  if (topic === ALL_TOPICS) return subject;
  return {
    ...subject,
    name: `${subject.name}: ${topic}`,
    questions: subject.questions.filter((q) => getTopic(q) === topic),
  };
}

interface TopicListProps {
  subject: Subject;
  onSelect: (topic: string) => void;
  onBack: () => void;
}

export default function TopicList({ subject, onSelect, onBack }: TopicListProps) {
  const topics = getTopics(subject);
  const total = subject.questions.length;

  const cardStyle = {
    backgroundColor: "var(--surface)",
    borderColor: "var(--border)",
    color: "var(--ink)",
  } as const;

  return (
    <div className="max-w-xl mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-semibold mb-4 rounded-md px-2 py-1 -ml-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        style={{ color: "var(--ink-muted)" }}
      >
        ← Back to subjects
      </button>

      <h1 className="text-2xl font-bold text-[var(--ink)] mb-1 tracking-tight">
        {subject.name}
      </h1>
      <p className="text-[var(--ink-muted)] mb-6 leading-relaxed">
        Study one topic, or take a quiz covering everything.
      </p>

      <button
        type="button"
        onClick={() => onSelect(ALL_TOPICS)}
        aria-label={`Quiz on all topics, ${total} questions`}
        className="w-full text-left rounded-lg p-4 mb-6 flex items-center justify-between border-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        style={{
          backgroundColor: "var(--accent)",
          borderColor: "var(--accent)",
          color: "var(--accent-ink)",
        }}
      >
        <div>
          <div className="font-semibold text-[17px]">All topics</div>
          <div className="text-sm opacity-80">
            {topics.length} topics mixed together
          </div>
        </div>
        <span className="text-sm font-semibold shrink-0 ml-3">
          {total} questions
        </span>
      </button>

      <p className="text-sm text-[var(--ink-muted)] mb-3">Or pick a topic</p>

      <div className="space-y-3">
        {topics.map((topic) => (
          <button
            key={topic.name}
            type="button"
            onClick={() => onSelect(topic.name)}
            aria-label={`Quiz on ${topic.name}, ${topic.count} questions`}
            className="w-full text-left transition-colors rounded-lg p-4 flex items-center justify-between border focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={cardStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--surface-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--surface)")
            }
          >
            <span className="font-semibold text-[17px] min-w-0">
              {topic.name}
            </span>
            <span className="text-sm text-[var(--ink-muted)] shrink-0 ml-3">
              {topic.count} question{topic.count !== 1 ? "s" : ""}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}