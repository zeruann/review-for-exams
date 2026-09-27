interface ResultsProps {
  subjectName: string;
  correctCount: number;
  totalCount: number;
  onRetry: () => void;
  onBackToSubjects: () => void;
}

function scoreMeta(percent: number) {
  if (percent >= 80) {
    return { color: "var(--good)", soft: "var(--good-soft)", message: "Strong work." };
  }
  if (percent >= 50) {
    return { color: "var(--okay)", soft: "var(--okay-soft)", message: "Getting there." };
  }
  return { color: "var(--low)", soft: "var(--low-soft)", message: "Worth another pass." };
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

  return (
    <div
      className="max-w-xl mx-auto text-center rounded-2xl p-8 border"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      <p className="text-sm mb-1" style={{ color: "var(--ink-muted)" }}>
        {subjectName}
      </p>

      <div
        className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
        style={{ backgroundColor: meta.soft }}
      >
        <span className="text-3xl font-bold" style={{ color: meta.color }}>
          {percent}%
        </span>
      </div>

      <p className="mb-1" style={{ color: "var(--ink)" }}>
        {correctCount} out of {totalCount} correct
      </p>
      <p className="text-sm mb-6" style={{ color: "var(--ink-muted)" }}>
        {meta.message}
      </p>

      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
        >
          Retry
        </button>
        <button
          onClick={onBackToSubjects}
          className="px-5 py-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          style={{ backgroundColor: "var(--surface-hover)", color: "var(--ink)" }}
        >
          Back to subjects
        </button>
      </div>
    </div>
  );
}