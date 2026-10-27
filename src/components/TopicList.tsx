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

  return (
    <div className="max-w-2xl mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="text-xs font-bold uppercase tracking-wider mb-5 py-2 px-3 rounded-xl border transition-all active-press flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--ink-muted)",
        }}
      >
        <span>←</span>
        <span>Back to Subjects</span>
      </button>

      {/* Header Banner */}
      <div
        className="rounded-2xl p-6 mb-6 border"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border"
            style={{
              backgroundColor: "var(--accent-soft)",
              borderColor: "var(--accent)",
              color: "var(--accent)",
            }}
          >
            Topic Filter
          </span>
          <span className="text-xs text-[var(--ink-muted)]">
            • {topics.length} topics available
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-2">
          {subject.name}
        </h1>
        <p className="text-sm md:text-base text-[var(--ink-muted)] leading-relaxed">
          Study one specific topic at a time, or challenge yourself with all topics mixed together.
        </p>
      </div>

      {/* Comprehensive All Topics card */}
      <button
        type="button"
        onClick={() => onSelect(ALL_TOPICS)}
        aria-label={`Quiz on all topics, ${total} questions`}
        className="w-full text-left rounded-2xl p-5 mb-5 flex items-center justify-between border-2 transition-all active-press shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        style={{
          backgroundColor: "var(--accent)",
          borderColor: "var(--accent)",
          color: "var(--accent-ink)",
        }}
      >
        <div className="flex items-center gap-3.5">
          <span className="text-2xl">⚡</span>
          <div>
            <div className="font-extrabold text-lg">All Topics Combined</div>
            <div className="text-xs md:text-sm opacity-90">
              {topics.length} topics shuffled into one complete session
            </div>
          </div>
        </div>
        <span
          className="text-xs font-bold shrink-0 ml-3 py-1.5 px-3 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        >
          {total} questions
        </span>
      </button>

      {/* Topic sub-heading */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>
          Focus on a single topic
        </span>
        <span className="text-xs text-[var(--ink-faint)]">{topics.length} options</span>
      </div>

      <div className="space-y-3">
        {topics.map((topic) => (
          <button
            key={topic.name}
            type="button"
            onClick={() => onSelect(topic.name)}
            aria-label={`Quiz on ${topic.name}, ${topic.count} questions`}
            className="w-full text-left transition-all rounded-2xl p-4 flex items-center justify-between border focus:outline-none focus:ring-2 focus:ring-[var(--accent)] active-press shadow-sm hover:shadow"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--ink)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--surface-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--surface)")
            }
          >
            <div className="flex items-center gap-3 min-w-0 pr-3">
              <span className="text-lg">📌</span>
              <span className="font-bold text-[15px] md:text-base truncate">
                {topic.name}
              </span>
            </div>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border shrink-0"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface-hover)",
                color: "var(--ink-muted)",
              }}
            >
              {topic.count} Qs
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}