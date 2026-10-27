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
    <div className="max-w-4xl mx-auto">
      {/* Header section with calm, welcoming tone */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2.5">
          <span
            className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border"
            style={{
              backgroundColor: "var(--accent-soft)",
              borderColor: "var(--accent)",
              color: "var(--accent)",
            }}
          >
            BSIT3A • 1st Semester
          </span>
          <span className="text-xs font-semibold" style={{ color: "var(--ink-muted)" }}>
            • Self-Paced Learning Studio
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--ink)] tracking-tight mb-2">
          What would you like to review today?
        </h1>
        <p className="text-base text-[var(--ink-muted)] max-w-xl leading-relaxed">
          Choose a review mode that fits your energy. Switch anytime without losing your progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Quizzes Card (Drill / Quick Practice - Highlighted for immediate momentum) */}
        <button
          type="button"
          onClick={() => onSelectPeriod("quizzes")}
          className="w-full text-left p-6 rounded-2xl border-2 transition-all flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-[var(--accent)] active-press shadow-sm hover:shadow-lg"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--accent)",
            color: "var(--ink)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--surface-hover)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--surface)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-3xl p-2.5 rounded-xl bg-[var(--accent-soft)]" aria-hidden="true">
                🎯
              </span>
              <span
                className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-ink)",
                }}
              >
                Recommended
              </span>
            </div>

            <h2 className="text-xl font-bold tracking-tight mb-1.5 text-[var(--ink)] flex items-center gap-2">
              <span>Quizzes Review</span>
            </h2>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-6">
              Bite-sized module exams, sub-quizzes, and targeted practice designed for fast feedback.
            </p>
          </div>

          <div className="pt-4 border-t w-full" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] mb-3 font-semibold">
              <span>{quizzesSubjects.length} subjects</span>
              <span>{quizzesTotalQuestions} questions</span>
            </div>

            {quizzesAttempted > 0 ? (
              <div className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color: "var(--accent)" }}>
                <span>⚡</span>
                <span>{quizzesAttempted} of {quizzesSubjects.length} attempted</span>
              </div>
            ) : (
              <div className="text-xs text-[var(--ink-faint)] mb-3 font-medium">
                Not yet attempted • Start fresh
              </div>
            )}

            <div
              className="w-full py-2.5 px-4 rounded-xl text-center font-bold text-sm transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-ink)",
              }}
            >
              <span>Start Quizzes</span>
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </div>
          </div>
        </button>

        {/* Midterm Card */}
        <button
          type="button"
          onClick={() => onSelectPeriod("midterm")}
          className="w-full text-left p-6 rounded-2xl border-2 transition-all flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-[var(--accent)] active-press shadow-sm hover:shadow-lg"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.backgroundColor = "var(--surface-hover)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.backgroundColor = "var(--surface)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-3xl p-2.5 rounded-xl" style={{ backgroundColor: "var(--surface-hover)" }} aria-hidden="true">
                📚
              </span>
              <span
                className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border"
                style={{
                  backgroundColor: "var(--surface-hover)",
                  borderColor: "var(--border)",
                  color: "var(--ink-muted)",
                }}
              >
                Comprehensive
              </span>
            </div>

            <h2 className="text-xl font-bold tracking-tight mb-1.5 text-[var(--ink)]">
              Midterm Review
            </h2>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-6">
              Full bank covering all midterm course objectives with options for topic filters.
            </p>
          </div>

          <div className="pt-4 border-t w-full" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] mb-3 font-semibold">
              <span>{midtermSubjects.length} subjects</span>
              <span>{midtermTotalQuestions} questions</span>
            </div>

            {midtermAttempted > 0 ? (
              <div className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color: "var(--accent)" }}>
                <span>✓</span>
                <span>{midtermAttempted} of {midtermSubjects.length} attempted</span>
              </div>
            ) : (
              <div className="text-xs text-[var(--ink-faint)] mb-3 font-medium">
                Not yet attempted
              </div>
            )}

            <div
              className="w-full py-2.5 px-4 rounded-xl text-center font-bold text-sm transition-all flex items-center justify-center gap-2 border"
              style={{
                backgroundColor: "var(--surface-hover)",
                borderColor: "var(--border)",
                color: "var(--ink)",
              }}
            >
              <span>Explore Midterm</span>
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </div>
          </div>
        </button>

        {/* Finals Card (Disabled) */}
        <div
          aria-disabled="true"
          className="w-full text-left p-6 rounded-2xl border-2 flex flex-col justify-between opacity-50 cursor-not-allowed select-none"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-3xl p-2.5 rounded-xl opacity-60" style={{ backgroundColor: "var(--surface-hover)" }} aria-hidden="true">
                🎓
              </span>
              <span
                className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border"
                style={{
                  backgroundColor: "var(--surface-hover)",
                  borderColor: "var(--border)",
                  color: "var(--ink-faint)",
                }}
              >
                Locked 🔒
              </span>
            </div>

            <h2 className="text-xl font-bold tracking-tight mb-1.5 text-[var(--ink)]">
              Finals Review
            </h2>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-6">
              Coming later in the semester. Review your midterms and quizzes first!
            </p>
          </div>

          <div className="pt-4 border-t w-full" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] mb-3 font-semibold">
              <span>{finalsSubjects.length} subjects</span>
              <span>{finalsTotalQuestions} questions</span>
            </div>

            <div className="text-xs text-[var(--ink-faint)] mb-3 font-medium">
              Available when finals approach
            </div>

            <div
              className="w-full py-2.5 px-4 rounded-xl text-center font-bold text-sm border opacity-60"
              style={{
                backgroundColor: "var(--surface-hover)",
                borderColor: "var(--border)",
                color: "var(--ink-faint)",
              }}
            >
              Locked for now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
