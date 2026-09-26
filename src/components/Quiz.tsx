import { useMemo, useState } from "react";
import type { Subject } from "../types/quiz";

interface QuizProps {
  subject: Subject;
  onFinish: (correctCount: number, totalCount: number) => void;
  onExit: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Quiz({ subject, onFinish, onExit }: QuizProps) {
  const questions = useMemo(() => shuffle(subject.questions), [subject]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const current = questions[index];
  const isLast = index === questions.length - 1;
  const isMulti = Boolean(current?.answers && current.answers.length > 0);
  const correctSet = current
    ? new Set(isMulti ? current.answers : [current.answer])
    : new Set<string>();

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

  function toggleChoice(choice: string) {
    if (showAnswer) return;
    if (!isMulti) {
      setSelected([choice]);
      return;
    }
    setSelected((prev) =>
      prev.includes(choice) ? prev.filter((c) => c !== choice) : [...prev, choice]
    );
  }

  function isCorrectSubmission() {
    if (selected.length !== correctSet.size) return false;
    return selected.every((c) => correctSet.has(c));
  }

  function handleSubmit() {
    if (selected.length === 0) return;
    setShowAnswer(true);
    if (isCorrectSubmission()) {
      setCorrectCount((c) => c + 1);
    }
  }

  function handleNext() {
    if (isLast) {
      onFinish(correctCount, questions.length);
      return;
    }
    setIndex((i) => i + 1);
    setSelected([]);
    setShowAnswer(false);
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
            if (showAnswer) {
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
                disabled={showAnswer}
                className={`w-full text-left px-4 py-3 rounded-xl border transition whitespace-pre-line ${style}`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {current.explanation && showAnswer && (
          <p className="mt-4 text-sm text-slate-400 bg-slate-900/60 rounded-lg p-3">
            {current.explanation}
          </p>
        )}

        {!showAnswer ? (
          <button
            onClick={handleSubmit}
            disabled={selected.length === 0}
            className="mt-5 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          >
            Check answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="mt-5 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium"
          >
            {isLast ? "Finish" : "Next question"}
          </button>
        )}
      </div>
    </div>
  );
}
