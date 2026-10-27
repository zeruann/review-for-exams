import type { Subject } from "../types/quiz";
import type { SubjectProgress } from "../hooks/useProgress";

interface SubQuizListProps {
  parentSubject: Subject;
  progress: Record<string, SubjectProgress>;
  onSelect: (subQuiz: Subject) => void;
  onBack: () => void;
}

function statusMeta(score: number) {
  if (score >= 80) {
    return {
      border: "border-l-[var(--good)]",
      chip: "text-[var(--good)] bg-[var(--good-soft)] border-[var(--good)]/20",
      bar: "bg-[var(--good)]",
      label: "Mastered",
      icon: "✓",
    };
  }
  if (score >= 50) {
    return {
      border: "border-l-[var(--okay)]",
      chip: "text-[var(--okay)] bg-[var(--okay-soft)] border-[var(--okay)]/20",
      bar: "bg-[var(--okay)]",
      label: "Practicing",
      icon: "⚡",
    };
  }
  return {
    border: "border-l-[var(--low)]",
    chip: "text-[var(--low)] bg-[var(--low-soft)] border-[var(--low)]/20",
    bar: "bg-[var(--low)]",
    label: "Needs Review",
    icon: "!",
  };
}

export default function SubQuizList({
  parentSubject,
  progress,
  onSelect,
  onBack,
}: SubQuizListProps) {
  const subQuizzes = parentSubject.subQuizzes ?? [];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Top back navigation */}
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

      {/* Header Context Card */}
      <div
        className="rounded-2xl p-6 mb-6 border"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="flex items-center gap-2 mb-2.5">
          <span
            className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border"
            style={{
              backgroundColor: "var(--accent-soft)",
              borderColor: "var(--accent)",
              color: "var(--accent)",
            }}
          >
            {parentSubject.name}
          </span>
          <span className="text-xs text-[var(--ink-muted)]">
            • Sub-Quizzes & Modules
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-1.5">
          Choose a Module Quiz
        </h1>
        <p className="text-sm md:text-base text-[var(--ink-muted)] leading-relaxed">
          Select a quiz to test your mastery. Take your time or customize your question limits in the next step.
        </p>
      </div>

      {/* Sub-quiz cards */}
      <div className="space-y-3.5">
        {subQuizzes.map((subQuiz) => {
          const p = progress[subQuiz.id];
          const score = p?.lastScorePercent;
          const meta = score != null ? statusMeta(score) : null;

          return (
            <button
              key={subQuiz.id}
              type="button"
              onClick={() => onSelect(subQuiz)}
              aria-label={`Review ${subQuiz.name}, ${subQuiz.questions.length} questions${
                score != null
                  ? `, last score ${score}%, ${meta?.label}`
                  : ", not yet attempted"
              }`}
              className={`w-full text-left transition-all rounded-2xl p-5 flex items-center justify-between border border-l-[6px] ${
                meta ? meta.border : "border-l-[var(--border)]"
              } focus:outline-none focus:ring-2 focus:ring-[var(--accent)] active-press shadow-sm hover:shadow-md`}
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--ink)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--surface-hover)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--surface)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">📄</span>
                  <div className="font-bold truncate text-[17px] md:text-lg tracking-tight text-[var(--ink)]">
                    {subQuiz.name}
                  </div>
                </div>

                <div className="text-xs md:text-sm text-[var(--ink-muted)] mb-3 pl-7">
                  {subQuiz.questions.length} questions • Comprehensive module pool
                </div>

                {score != null ? (
                  <div className="w-full max-w-[200px] pl-7">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-[var(--ink-muted)] mb-1">
                      <span>Previous score</span>
                      <span>{score}%</span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--bg)" }}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${meta!.bar}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] font-semibold text-[var(--ink-faint)] pl-7">
                    Not started yet • Tap to configure & begin
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {meta ? (
                  <span
                    className={`flex items-center gap-1.5 text-xs md:text-sm font-bold rounded-xl px-3 py-1.5 border ${meta.chip}`}
                  >
                    <span aria-hidden="true">{meta.icon}</span>
                    {score}%
                  </span>
                ) : (
                  <span
                    className="text-xs font-semibold px-3.5 py-2 rounded-xl border flex items-center gap-1.5"
                    style={{
                      color: "var(--ink-muted)",
                      borderColor: "var(--border)",
                      backgroundColor: "var(--surface-hover)",
                    }}
                  >
                    <span>Start</span>
                    <span>→</span>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
