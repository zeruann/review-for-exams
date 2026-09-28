import type { Subject } from "../types/quiz";

// Only these subjects show the options screen before the quiz.
// To change which subjects get it, edit this function.
export function usesQuizOptions(subject: Subject): boolean {
  return subject.name.startsWith("Networking 2");
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
        {subject.questions.length} questions available. Set up your quiz.
      </p>

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

      <button
        type="button"
        onClick={onStart}
        className="w-full rounded-lg px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
      >
        Start quiz
      </button>
    </div>
  );
}