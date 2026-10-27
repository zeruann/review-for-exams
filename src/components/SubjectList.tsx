import { useMemo, useState } from "react";
import type { Subject, ExamPeriod } from "../types/quiz";
import type { SubjectProgress } from "../hooks/useProgress";

interface SubjectListProps {
  subjects: Subject[];
  progress: Record<string, SubjectProgress>;
  onSelect: (subject: Subject) => void;
  period?: ExamPeriod;
  onBackToPeriod?: () => void;
  onChangePeriod?: (period: ExamPeriod) => void;
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

export default function SubjectList({
  subjects,
  progress,
  onSelect,
  period = "midterm",
  onBackToPeriod,
  onChangePeriod,
}: SubjectListProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      subjects.filter((s) =>
        s.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [subjects, query]
  );

  const attemptedCount = subjects.filter(
    (s) => progress[s.id]?.lastScorePercent != null
  ).length;

  const avgScore =
    attemptedCount > 0
      ? Math.round(
          subjects.reduce(
            (sum, s) => sum + (progress[s.id]?.lastScorePercent ?? 0),
            0
          ) / attemptedCount
        )
      : null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Top action bar */}
      <div className="flex items-center justify-between mb-5 gap-3">
        {onBackToPeriod ? (
          <button
            type="button"
            onClick={onBackToPeriod}
            className="text-xs font-bold uppercase tracking-wider py-2 px-3 rounded-xl border transition-all active-press flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--ink-muted)",
            }}
          >
            <span>←</span>
            <span>Switch Category</span>
          </button>
        ) : (
          <span />
        )}

        {onChangePeriod && (
          <div
            role="radiogroup"
            aria-label="Exam period"
            className="inline-flex rounded-full border p-1 gap-1 shadow-sm"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
            }}
          >
            {(["midterm", "finals", "quizzes"] as ExamPeriod[]).map((p) => {
              const isDisabled = p === "finals";
              const isActive = period === p;
              return (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  disabled={isDisabled}
                  aria-checked={isActive}
                  onClick={() => !isDisabled && onChangePeriod(p)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all focus:outline-none focus:ring-2 active-press ${
                    isDisabled ? "opacity-35 cursor-not-allowed" : ""
                  }`}
                  style={{
                    backgroundColor: isActive ? "var(--accent)" : "transparent",
                    color: isActive ? "var(--accent-ink)" : "var(--ink-muted)",
                    boxShadow: isActive ? "0 2px 6px rgba(13, 148, 136, 0.2)" : "none",
                  }}
                  title={isDisabled ? "Finals is locked" : undefined}
                >
                  {p} {isDisabled ? "🔒" : ""}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Header / Context Banner */}
      <div
        className="rounded-2xl p-5 md:p-6 mb-6 border relative overflow-hidden"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span
            className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border"
            style={{
              backgroundColor: "var(--accent-soft)",
              borderColor: "var(--accent)",
              color: "var(--accent)",
            }}
          >
            BSIT3A • 1st Semester
          </span>

          <span
            className="text-xs font-bold px-3 py-1 rounded-full capitalize"
            style={{
              backgroundColor: "var(--surface-hover)",
              color: "var(--ink-muted)",
              border: "1px solid var(--border)",
            }}
          >
            {period === "quizzes" ? "🎯 Drill Mode" : "📖 Exam Review"}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-1.5">
          {period === "quizzes"
            ? "Quizzes Review"
            : period === "finals"
            ? "Finals Exam Review"
            : "Midterm Exam Review"}
        </h1>

        <p className="text-sm md:text-base text-[var(--ink-muted)] mb-4 leading-relaxed">
          {period === "quizzes"
            ? "Subject quizzes and quick drills designed for focused, bite-sized mastery."
            : period === "finals"
            ? "2 questions per subject to review for finals."
            : "Pick a subject to review questions at your own comfortable pace."}
        </p>

        {/* Stats Pill Strip */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t text-xs" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
            <span className="font-bold text-[var(--ink)]">{subjects.length}</span>
            <span className="text-[var(--ink-muted)]">subjects</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--surface-hover)" }}>
            <span className="font-bold text-[var(--accent)]">{attemptedCount}</span>
            <span className="text-[var(--ink-muted)]">attempted</span>
          </div>

          {avgScore != null && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg ml-auto" style={{ backgroundColor: "var(--good-soft)" }}>
              <span className="text-sm">⭐</span>
              <span className="font-extrabold text-[var(--good)]">{avgScore}%</span>
              <span className="text-[var(--ink-muted)]">avg score</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Filter Search Bar */}
      {subjects.length > 3 && (
        <div className="relative mb-5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects or topics..."
            aria-label="Search subjects"
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)] shadow-sm"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--ink)",
            }}
          />
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
            style={{ color: "var(--ink-faint)" }}
          >
            🔍
          </span>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs py-1 px-2 rounded hover:opacity-80"
              style={{ color: "var(--ink-muted)", backgroundColor: "var(--surface-hover)" }}
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Subject Cards Grid / Stack */}
      <div className="space-y-3.5">
        {filtered.length === 0 && (
          <div
            className="text-center py-12 px-4 rounded-2xl border"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <span className="text-3xl mb-2 block">🔍</span>
            <p className="font-semibold text-[var(--ink)] mb-1">No subjects match "{query}"</p>
            <p className="text-sm text-[var(--ink-muted)]">Try searching with a different keyword.</p>
          </div>
        )}

        {filtered.map((subject) => {
          const p = progress[subject.id];
          const score = p?.lastScorePercent;
          const meta = score != null ? statusMeta(score) : null;
          const hasSubQuizzes = Boolean(subject.subQuizzes && subject.subQuizzes.length > 0);

          return (
            <button
              key={subject.id}
              onClick={() => onSelect(subject)}
              aria-label={`Review ${subject.name}, ${subject.questions.length} questions${
                score != null
                  ? `, last score ${score}%, ${meta?.label}`
                  : ", not yet attempted"
              }`}
              className={`w-full text-left transition-all rounded-2xl p-4 md:p-5 flex items-center justify-between border border-l-[6px] ${
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
                  <div className="font-bold truncate text-[17px] md:text-lg tracking-tight text-[var(--ink)]">
                    {subject.name}
                  </div>
                  {hasSubQuizzes && (
                    <span
                      className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border shrink-0"
                      style={{
                        backgroundColor: "var(--accent-soft)",
                        borderColor: "var(--accent)",
                        color: "var(--accent)",
                      }}
                    >
                      {subject.subQuizzes!.length} Sub-quiz{subject.subQuizzes!.length > 1 ? "zes" : ""}
                    </span>
                  )}
                </div>

                <div className="text-xs md:text-sm text-[var(--ink-muted)] mb-3 flex items-center gap-2">
                  <span>📝 {subject.questions.length} questions</span>
                  {hasSubQuizzes && <span>• Includes module exam</span>}
                </div>

                {score != null ? (
                  <div className="w-full max-w-[200px]">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-[var(--ink-muted)] mb-1">
                      <span>Progress</span>
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
                  <div className="text-[11px] font-semibold text-[var(--ink-faint)]">
                    Ready to start • Tap to practice
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
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border"
                    style={{
                      color: "var(--ink-faint)",
                      borderColor: "var(--border)",
                      backgroundColor: "var(--surface-hover)",
                    }}
                  >
                    Start →
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