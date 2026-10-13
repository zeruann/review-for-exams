import type { ExamPeriod, Subject } from "../types/quiz";
import type { SubjectProgress } from "../hooks/useProgress";

interface PeriodSelectionProps {
  midtermSubjects: Subject[];
  finalsSubjects: Subject[];
  quizzesSubjects: Subject[];
  midtermProgress: Record<string, SubjectProgress>;
  finalsProgress: Record<string, SubjectProgress>;
  quizzesProgress: Record<string, SubjectProgress>;
  onSelectPeriod: (period: ExamPeriod) => void;
}

export default function PeriodSelection({
  midtermSubjects,
  finalsSubjects,
  quizzesSubjects,
  midtermProgress,
  finalsProgress: _finalsProgress,
  quizzesProgress,
  onSelectPeriod,
}: PeriodSelectionProps) {
  const midtermTotalQuestions = midtermSubjects.reduce(
    (sum, s) => sum + s.questions.length,
    0
  );
  const midtermAttempted = midtermSubjects.filter(
    (s) => midtermProgress[s.id]?.lastScorePercent != null
  ).length;

  const finalsTotalQuestions = finalsSubjects.reduce(
    (sum, s) => sum + s.questions.length,
    0
  );

  const quizzesTotalQuestions = quizzesSubjects.reduce(
    (sum, s) => sum + s.questions.length,
    0
  );
  const quizzesAttempted = quizzesSubjects.filter(
    (s) => quizzesProgress[s.id]?.lastScorePercent != null
  ).length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--accent)",
            }}
          >
            BSIT3A - 1st Semester
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--ink)] tracking-tight mb-1">
          Exam Review
        </h1>
        <p className="text-[var(--ink-muted)] text-base leading-relaxed">
          Select a category to begin reviewing your subjects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Midterm Card */}
        <button
          type="button"
          onClick={() => onSelectPeriod("midterm")}
          className="w-full text-left p-5 rounded-xl border-2 transition-all flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.backgroundColor = "var(--surface-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.backgroundColor = "var(--surface)";
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-2xl" aria-hidden="true">
                📚
              </span>
              <span
                className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-ink)",
                }}
              >
                Comprehensive
              </span>
            </div>

            <h2 className="text-xl font-bold tracking-tight mb-1 text-[var(--ink)]">
              Midterm
            </h2>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-4">
              Complete question banks across all subjects for midterm exam preparation.
            </p>
          </div>

          <div className="pt-4 border-t w-full" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] mb-3">
              <span>{midtermSubjects.length} subjects</span>
              <span>{midtermTotalQuestions} questions</span>
            </div>

            {midtermAttempted > 0 && (
              <div className="text-xs text-[var(--accent)] font-semibold mb-3">
                {midtermAttempted} of {midtermSubjects.length} attempted
              </div>
            )}

            <div
              className="w-full py-2.5 px-3 rounded-lg text-center font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
              style={{
                backgroundColor: "var(--surface-hover)",
                color: "var(--ink)",
              }}
            >
              <span>Review Midterm</span>
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </div>
          </div>
        </button>

        {/* Finals Card (Disabled) */}
        <div
          aria-disabled="true"
          className="w-full text-left p-5 rounded-xl border-2 flex flex-col justify-between opacity-55 cursor-not-allowed select-none"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-2xl filter grayscale opacity-70" aria-hidden="true">
                🎯
              </span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: "var(--surface-hover)",
                  color: "var(--ink-muted)",
                  border: "1px solid var(--border)",
                }}
              >
                🔒 Locked
              </span>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold tracking-tight text-[var(--ink-muted)]">
                Finals
              </h2>
            </div>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-4">
              Finals exam review starter set with 2 questions for each subject.
            </p>
          </div>

          <div className="pt-4 border-t w-full" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] mb-3">
              <span>{finalsSubjects.length} subjects</span>
              <span>{finalsTotalQuestions} questions</span>
            </div>

            <div
              className="w-full py-2.5 px-3 rounded-lg text-center font-semibold text-sm flex items-center justify-center gap-1.5 cursor-not-allowed"
              style={{
                backgroundColor: "var(--surface-hover)",
                color: "var(--ink-muted)",
              }}
            >
              <span>🔒 Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Quizzes Card */}
        <button
          type="button"
          onClick={() => onSelectPeriod("quizzes")}
          className="w-full text-left p-5 rounded-xl border-2 transition-all flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.backgroundColor = "var(--surface-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.backgroundColor = "var(--surface)";
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-2xl" aria-hidden="true">
                📝
              </span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: "var(--surface-hover)",
                  color: "var(--accent)",
                  border: "1px solid var(--border)",
                }}
              >
                Practice
              </span>
            </div>

            <h2 className="text-xl font-bold tracking-tight mb-1 text-[var(--ink)]">
              Quizzes
            </h2>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-4">
              Targeted subject quizzes and quick drills to evaluate your comprehension.
            </p>
          </div>

          <div className="pt-4 border-t w-full" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] mb-3">
              <span>{quizzesSubjects.length} subjects</span>
              <span>{quizzesTotalQuestions} questions</span>
            </div>

            {quizzesAttempted > 0 && (
              <div className="text-xs text-[var(--accent)] font-semibold mb-3">
                {quizzesAttempted} of {quizzesSubjects.length} attempted
              </div>
            )}

            <div
              className="w-full py-2.5 px-3 rounded-lg text-center font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
              style={{
                backgroundColor: "var(--surface-hover)",
                color: "var(--ink)",
              }}
            >
              <span>Review Quizzes</span>
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
