import { useMemo, useState } from "react";
import type { Subject } from "../types/quiz";

interface QuizProps {
  subject: Subject;
  shuffleQuestions: boolean;
  onFinish: (correctCount: number, totalCount: number) => void;
  onExit: () => void;
}

interface AnswerState {
  selected: string[];
  revealed: boolean;
  skipped: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const EMPTY_STATE: AnswerState = { selected: [], revealed: false, skipped: false };

export default function Quiz({
  subject,
  shuffleQuestions,
  onFinish,
  onExit,
}: QuizProps) {
  const questions = useMemo(
    () => (shuffleQuestions ? shuffle(subject.questions) : subject.questions),
    [subject, shuffleQuestions]
  );
  const [index, setIndex] = useState(0);
  const [answersByIndex, setAnswersByIndex] = useState<Record<number, AnswerState>>({});

  const current = questions[index];
  const isLast = index === questions.length - 1;
  const isFirst = index === 0;
  const isMulti = Boolean(current?.answers && current.answers.length > 0);
  const correctSet = current
    ? new Set(isMulti ? current.answers : [current.answer])
    : new Set<string>();

  const currentState = answersByIndex[index] ?? EMPTY_STATE;
  const { selected, revealed } = currentState;

  function correctSetFor(i: number): Set<string> {
    const q = questions[i];
    const multi = Boolean(q.answers && q.answers.length > 0);
    return new Set(multi ? q.answers : [q.answer]);
  }

  function isSelectionCorrect(i: number, sel: string[]): boolean {
    const cs = correctSetFor(i);
    if (sel.length !== cs.size) return false;
    return sel.every((c) => cs.has(c));
  }

  // Live running score across all questions answered so far (excludes skips).
  const answeredEntries = Object.entries(answersByIndex).filter(
    ([, s]) => s.revealed && !s.skipped
  );
  const runningCorrect = answeredEntries.filter(([i, s]) =>
    isSelectionCorrect(Number(i), s.selected)
  ).length;
  const runningAnswered = answeredEntries.length;

  if (!current) {
    return (
      <div className="text-center text-slate-300">
        This subject has no questions yet.
        <button
          onClick={onExit}
          className="block mx-auto mt-4 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
        >
          Back
        </button>
      </div>
    );
  }

  function updateCurrent(patch: Partial<AnswerState>) {
    setAnswersByIndex((prev) => ({
      ...prev,
      [index]: { ...(prev[index] ?? EMPTY_STATE), ...patch },
    }));
  }

  function toggleChoice(choice: string) {
    if (revealed) return;
    if (!isMulti) {
      updateCurrent({ selected: [choice] });
      return;
    }
    const next = selected.includes(choice)
      ? selected.filter((c) => c !== choice)
      : [...selected, choice];
    updateCurrent({ selected: next });
  }

  function handleCheck() {
    if (selected.length === 0) return;
    updateCurrent({ revealed: true, skipped: false });
  }

  function handleSkip() {
    updateCurrent({ revealed: true, skipped: true, selected: [] });
  }

  function handlePrevious() {
    if (!isFirst) setIndex((i) => i - 1);
  }

  function handleNext() {
    if (isLast) {
      let correctCount = 0;
      questions.forEach((_, i) => {
        const st = answersByIndex[i];
        if (st?.revealed && !st.skipped && isSelectionCorrect(i, st.selected)) {
          correctCount++;
        }
      });
      onFinish(correctCount, questions.length);
      return;
    }
    setIndex((i) => i + 1);
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4 text-sm text-slate-400">
        <button onClick={onExit} className="hover:text-slate-200">
          ← Exit
        </button>
        <span>
          Question {index + 1} / {questions.length}
        </span>
        <span className="font-medium text-indigo-400">
          Score: {runningCorrect}/{runningAnswered}
        </span>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-slate-100 mb-3">
          {current.question}
        </h2>

        {isMulti && (
          <p className="text-xs text-indigo-400 mb-3">
            Select {current.answers!.length} answers.
          </p>
        )}

        {current.image && (
          <img
            src={current.image}
            alt="Exhibit"
            className="w-full rounded-lg mb-4 bg-slate-900"
          />
        )}

        {current.exhibit && (
          <pre className="whitespace-pre-wrap break-words text-xs text-slate-300 bg-slate-950 border border-slate-700 rounded-lg p-3 mb-4 overflow-x-auto">
            {current.exhibit}
          </pre>
        )}

        <div className="space-y-3">
          {current.choices.map((choice) => {
            const isSelected = selected.includes(choice);
            const isCorrectChoice = correctSet.has(choice);
            let style =
              "border-slate-600 hover:border-slate-400 hover:bg-slate-700/50";
            if (revealed) {
              if (isCorrectChoice) {
                style = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
              } else if (isSelected && !isCorrectChoice) {
                style = "border-rose-500 bg-rose-500/10 text-rose-300";
              } else {
                style = "border-slate-700 opacity-60";
              }
            } else if (isSelected) {
              style = "border-indigo-500 bg-indigo-500/10 text-indigo-200";
            }
            return (
              <button
                key={choice}
                onClick={() => toggleChoice(choice)}
                disabled={revealed}
                className={`w-full text-left px-4 py-3 rounded-xl border transition whitespace-pre-line ${style}`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {revealed && currentState.skipped && (
          <p className="mt-4 text-xs text-amber-400">
            Skipped — correct answer shown above.
          </p>
        )}

        {current.explanation && revealed && (
          <p className="mt-4 text-sm text-slate-400 bg-slate-900/60 rounded-lg p-3">
            {current.explanation}
          </p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={isFirst}
            className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed font-medium"
          >
            ← Previous
          </button>

          {!revealed ? (
            <>
              <button
                onClick={handleSkip}
                className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 font-medium"
              >
                Skip
              </button>
              <button
                onClick={handleCheck}
                disabled={selected.length === 0}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
              >
                Check
              </button>
            </>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium"
            >
              {isLast ? "Finish" : "Next"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}