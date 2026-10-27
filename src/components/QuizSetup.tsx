import type { Subject } from "../types/quiz";

// Only these subjects show the options screen before the quiz.
export function usesQuizOptions(subject: Subject): boolean {
  return (
    subject.name.startsWith("Networking 2") ||
    subject.name.includes("Module Group Exam")
  );
}

interface QuizSetupProps {
  subject: Subject;
  shuffleQuestions: boolean;
  onToggleShuffle: (value: boolean) => void;
  questionLimit: string;
  onChangeQuestionLimit: (value: string) => void;
  timerEnabled: boolean;
  onToggleTimer: (value: boolean) => void;
  onStart: () => void;
  onBack: () => void;
}

export default function QuizSetup({
  subject,
  shuffleQuestions,
  onToggleShuffle,
  questionLimit,
  onChangeQuestionLimit,
  timerEnabled,
  onToggleTimer,
  onStart,
  onBack,
}: QuizSetupProps) {
  return (
    <div className="max-w-xl mx-auto">
      {/* Top back button */}
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
        <span>Back</span>
      </button>

      {/* Main card */}
      <div
        className="rounded-3xl border p-6 md:p-8 relative overflow-hidden"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "0 10px 30px -4px rgba(0, 0, 0, 0.05)",
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
            Quiz Setup
          </span>
          <span className="text-xs text-[var(--ink-muted)]">
            • Customize your session
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--ink)] mb-2 tracking-tight">
          {subject.name}
        </h1>
        <p className="text-sm md:text-base text-[var(--ink-muted)] mb-7 leading-relaxed">
          {subject.questions.length} total questions available. Adjust your preferences for maximum focus.
        </p>

        {/* ADHD Friendly Option Cards */}
        <div className="space-y-4 mb-8">
          {/* Option: Shuffle Questions */}
          <div
            onClick={() => onToggleShuffle(!shuffleQuestions)}
            className="p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none hover:border-[var(--accent)]"
            style={{
              backgroundColor: shuffleQuestions ? "var(--accent-soft)" : "var(--surface-hover)",
              borderColor: shuffleQuestions ? "var(--accent)" : "var(--border)",
            }}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl">🔀</span>
              <div>
                <div className="font-bold text-sm md:text-base text-[var(--ink)]">
                  Shuffle Questions
                </div>
                <div className="text-xs text-[var(--ink-muted)]">
                  Randomize question order each attempt to keep your brain alert.
                </div>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${
                shuffleQuestions ? "bg-[var(--accent)] border-[var(--accent)]" : "border-[var(--ink-faint)]"
              }`}
            >
              {shuffleQuestions && (
                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Option: Questions per quiz */}
          <div
            className="p-4 rounded-2xl border transition-all"
            style={{
              backgroundColor: "var(--surface-hover)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3.5">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="font-bold text-sm md:text-base text-[var(--ink)]">
                    Session Length
                  </div>
                  <div className="text-xs text-[var(--ink-muted)]">
                    Pick a bite-sized chunk to prevent cognitive overload.
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { value: "all", label: `All (${subject.questions.length})`, desc: "Full exam" },
                { value: "33", label: "33 items", desc: "Exam chunk" },
                { value: "35", label: "35 items", desc: "Sprint drill" },
              ].map((opt) => {
                const isSelected = questionLimit === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChangeQuestionLimit(opt.value)}
                    className={`py-2.5 px-3 rounded-xl border text-left transition-all active-press flex flex-col justify-between ${
                      isSelected ? "border-[var(--accent)] shadow-sm" : ""
                    }`}
                    style={{
                      backgroundColor: isSelected ? "var(--accent-soft)" : "var(--surface)",
                      borderColor: isSelected ? "var(--accent)" : "var(--border)",
                    }}
                  >
                    <span
                      className="font-bold text-xs md:text-sm"
                      style={{ color: isSelected ? "var(--accent)" : "var(--ink)" }}
                    >
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-[var(--ink-muted)]">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Option: Timer */}
          <div
            onClick={() => onToggleTimer(!timerEnabled)}
            className="p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none hover:border-[var(--accent)]"
            style={{
              backgroundColor: timerEnabled ? "var(--accent-soft)" : "var(--surface-hover)",
              borderColor: timerEnabled ? "var(--accent)" : "var(--border)",
            }}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl">⏱</span>
              <div>
                <div className="font-bold text-sm md:text-base text-[var(--ink)]">
                  60-Minute Countdown Timer
                </div>
                <div className="text-xs text-[var(--ink-muted)]">
                  {timerEnabled
                    ? "Timer is active. Test yourself under time conditions."
                    : "Timer is off. Enjoy relaxed, untimed self-study."}
                </div>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${
                timerEnabled ? "bg-[var(--accent)] border-[var(--accent)]" : "border-[var(--ink-faint)]"
              }`}
            >
              {timerEnabled && (
                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Big tactile Start button */}
        <button
          type="button"
          onClick={onStart}
          className="w-full py-4 px-6 rounded-2xl font-extrabold text-base md:text-lg transition-all active-press shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] flex items-center justify-center gap-2"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--accent-ink)",
          }}
        >
          <span>Begin Quiz</span>
          <span className="text-xl">🚀</span>
        </button>
      </div>
    </div>
  );
}