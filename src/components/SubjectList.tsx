import { useMemo, useState } from "react";
import type { Subject } from "../types/quiz";
import type { SubjectProgress } from "../hooks/useProgress";

interface SubjectListProps {
  subjects: Subject[];
  progress: Record<string, SubjectProgress>;
  shuffleQuestions: boolean;
  onToggleShuffle: (value: boolean) => void;
  questionLimit: string;
  onChangeQuestionLimit: (value: string) => void;
  timerEnabled: boolean;
  onToggleTimer: (value: boolean) => void;
  onSelect: (subject: Subject) => void;
}

function statusMeta(score: number) {
  if (score >= 80) {
    return {
      border: "border-l-[var(--good)]",
      chip: "text-[var(--good)] bg-[var(--good-soft)]",
      bar: "bg-[var(--good)]",
      label: "Strong",
      icon: "✓",
    };
  }
  if (score >= 50) {
    return {
      border: "border-l-[var(--okay)]",
      chip: "text-[var(--okay)] bg-[var(--okay-soft)]",
      bar: "bg-[var(--okay)]",
      label: "Okay",
      icon: "~",
    };
  }
  return {
    border: "border-l-[var(--low)]",
    chip: "text-[var(--low)] bg-[var(--low-soft)]",
    bar: "bg-[var(--low)]",
    label: "Needs work",
    icon: "!",
  };
}

export default function SubjectList({
  subjects,
  progress,
  shuffleQuestions,
  onToggleShuffle,
  questionLimit,
  onChangeQuestionLimit,
  timerEnabled,
  onToggleTimer,
  onSelect,
}: SubjectListProps) {
  const [query, setQuery] = useState("");

  const maxQuestions = Math.max(0, ...subjects.map((s) => s.questions.length));
  const showQuizOptions = maxQuestions > 10;

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
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--ink)] mb-1 tracking-tight">
        Exam Review
      </h1>
      <p className="text-[var(--ink-muted)] mb-1 leading-relaxed">
        Pick a subject to start reviewing.
      </p>

      <p className="text-sm text-[var(--ink-muted)] mb-6">
        {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
        {" · "}
        {attemptedCount} attempted
        {avgScore != null && <> · {avgScore}% average</>}
      </p>

      {subjects.length > 5 && (
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search subjects…"
          aria-label="Search subjects"
          className="w-full mb-5 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
        />
      )}

      {showQuizOptions && (
        <div
          className="flex flex-wrap items-center gap-x-6 gap-y-4 mb-6 text-[15px] rounded-lg border p-4"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
        >
          <label className="flex items-center gap-2.5 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={shuffleQuestions}
              onChange={(e) => onToggleShuffle(e.target.checked)}
              className="w-5 h-5 accent-[var(--accent)]"
            />
            Shuffle questions
          </label>

          <label className="flex items-center gap-2.5 select-none cursor-pointer">
            Questions per quiz:
            <select
              value={questionLimit}
              onChange={(e) => onChangeQuestionLimit(e.target.value)}
              className="border rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{
                backgroundColor: "var(--bg)",
                borderColor: "var(--border)",
                color: "var(--ink)",
              }}
            >
              <option value="all">All</option>
              <option value="30">30 (exam-length)</option>
              <option value="40">40 (exam-length)</option>
            </select>
          </label>

          <label className="flex items-center gap-2.5 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={timerEnabled}
              onChange={(e) => onToggleTimer(e.target.checked)}
              className="w-5 h-5 accent-[var(--accent)]"
            />
            60-minute timer
          </label>
        </div>
      )}

      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-[var(--ink-muted)] text-center py-10">
            No subjects match "{query}".
          </p>
        )}

        {filtered.map((subject) => {
          const p = progress[subject.id];
          const score = p?.lastScorePercent;
          const meta = score != null ? statusMeta(score) : null;

          return (
            <button
              key={subject.id}
              onClick={() => onSelect(subject)}
              aria-label={`Review ${subject.name}, ${subject.questions.length} questions${
                score != null
                  ? `, last score ${score}%, ${meta?.label}`
                  : ", not yet attempted"
              }`}
              className={`w-full text-left transition-colors rounded-lg p-4 flex items-center justify-between border border-l-4 ${
                meta ? meta.border : "border-l-[var(--border)]"
              } focus:outline-none focus:ring-2 focus:ring-[var(--accent)]`}
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
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate text-[17px]">
                  {subject.name}
                </div>
                <div className="text-sm text-[var(--ink-muted)] mb-2.5">
                  {subject.questions.length} questions
                </div>
                {score != null && (
                  <div
                    className="w-full h-2 rounded-full overflow-hidden max-w-[160px]"
                    style={{ backgroundColor: "var(--bg)" }}
                  >
                    <div
                      className={`h-full rounded-full ${meta!.bar}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                )}
              </div>

              {meta ? (
                <span
                  className={`flex items-center gap-1.5 text-sm font-semibold rounded-md px-3 py-1.5 ml-3 shrink-0 ${meta.chip}`}
                >
                  <span aria-hidden="true">{meta.icon}</span>
                  {score}%
                </span>
              ) : (
                <span className="text-sm text-[var(--ink-faint)] ml-3 shrink-0">
                  Not started
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}