interface ResultsProps {
  subjectName: string;
  correctCount: number;
  totalCount: number;
  onRetry: () => void;
  onBackToSubjects: () => void;
}

function scoreMeta(percent: number) {
  if (percent >= 80) {
    return {
      color: "var(--good)",
      soft: "var(--good-soft)",
      message: "Outstanding work! You've got strong command of these concepts.",
      emoji: "🎉",
      badge: "Mastery Level",
    };
  }
  if (percent >= 50) {
    return {
      color: "var(--okay)",
      soft: "var(--okay-soft)",
      message: "Great progress! A quick review on missed items will lock this in.",
      emoji: "⚡",
      badge: "Solid Effort",
    };
  }
  return {
    color: "var(--low)",
    soft: "var(--low-soft)",
    message: "Don't sweat it! Repetition builds muscle memory. Give it another pass.",
    emoji: "🌱",
    badge: "Learning Opportunity",
  };
}

export default function Results({
  subjectName,
  correctCount,
  totalCount,
  onRetry,
  onBackToSubjects,
}: ResultsProps) {
  const percent = Math.round((correctCount / totalCount) * 100);
  const meta = scoreMeta(percent);
  const missedCount = totalCount - correctCount;

  return (
    <div
      className="max-w-xl mx-auto text-center rounded-3xl p-6 md:p-10 border shadow-lg relative overflow-hidden"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* Top Tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4 border"
        style={{
          backgroundColor: meta.soft,
          color: meta.color,
          borderColor: meta.color,
        }}
      >
        <span>{meta.emoji}</span>
        <span>{meta.badge}</span>
      </div>

      <h1 className="text-xl md:text-2xl font-extrabold text-[var(--ink)] tracking-tight mb-2">
        {subjectName}
      </h1>

      {/* Big Score Ring / Pill */}
      <div
        className="w-32 h-32 mx-auto my-5 rounded-3xl flex flex-col items-center justify-center border-2 transition-transform hover:scale-105"
        style={{
          backgroundColor: meta.soft,
          borderColor: meta.color,
        }}
      >
        <span className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: meta.color }}>
          {percent}%
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-80" style={{ color: meta.color }}>
          Accuracy
        </span>
      </div>

      {/* Breakdown stat pills */}
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6">
        <div className="p-3 rounded-2xl border" style={{ backgroundColor: "var(--surface-hover)", borderColor: "var(--border)" }}>
          <div className="text-xs text-[var(--ink-muted)] mb-0.5">Correct</div>
          <div className="text-lg font-bold text-[var(--good)]">✓ {correctCount}</div>
        </div>
        <div className="p-3 rounded-2xl border" style={{ backgroundColor: "var(--surface-hover)", borderColor: "var(--border)" }}>
          <div className="text-xs text-[var(--ink-muted)] mb-0.5">Needs Review</div>
          <div className="text-lg font-bold" style={{ color: missedCount > 0 ? "var(--low)" : "var(--good)" }}>
            {missedCount > 0 ? `✗ ${missedCount}` : "None! 🎉"}
          </div>
        </div>
      </div>

      <p className="text-sm md:text-base mb-8 max-w-sm mx-auto leading-relaxed" style={{ color: "var(--ink-muted)" }}>
        {meta.message}
      </p>

      {/* ADHD Clear Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onRetry}
          className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm md:text-base transition-all active-press shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] flex items-center justify-center gap-2"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
        >
          <span>🔄 Practice Again</span>
        </button>
        <button
          onClick={onBackToSubjects}
          className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm md:text-base border transition-all active-press focus:outline-none focus:ring-2 focus:ring-[var(--accent)] flex items-center justify-center gap-2"
          style={{
            backgroundColor: "var(--surface-hover)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
        >
          <span>← Back to Subjects</span>
        </button>
      </div>
    </div>
  );
}