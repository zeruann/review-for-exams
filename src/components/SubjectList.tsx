import type { Subject } from "../types/quiz";
import type { SubjectProgress } from "../hooks/useProgress";

interface SubjectListProps {
  subjects: Subject[];
  progress: Record<string, SubjectProgress>;
  onSelect: (subject: Subject) => void;
}

export default function SubjectList({
  subjects,
  progress,
  onSelect,
}: SubjectListProps) {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">Exam Review</h1>
      <p className="text-slate-400 mb-6">Pick a subject to start reviewing.</p>

      <div className="space-y-3">
        {subjects.map((subject) => {
          const p = progress[subject.id];
          return (
            <button
              key={subject.id}
              onClick={() => onSelect(subject)}
              className="w-full text-left bg-slate-800 hover:bg-slate-700 transition rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-slate-100">
                  {subject.name}
                </div>
                <div className="text-sm text-slate-400">
                  {subject.questions.length} questions
                </div>
              </div>
              {p?.lastScorePercent != null && (
                <div className="text-sm font-semibold text-indigo-400">
                  {p.lastScorePercent}%
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
