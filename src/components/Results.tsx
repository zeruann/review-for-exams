interface ResultsProps {
  subjectName: string;
  correctCount: number;
  totalCount: number;
  onRetry: () => void;
  onBackToSubjects: () => void;
}

export default function Results({
  subjectName,
  correctCount,
  totalCount,
  onRetry,
  onBackToSubjects,
}: ResultsProps) {
  const percent = Math.round((correctCount / totalCount) * 100);

  return (
    <div className="max-w-xl mx-auto text-center bg-slate-800 rounded-2xl p-8 shadow-lg">
      <p className="text-slate-400 mb-1">{subjectName}</p>
      <div className="text-5xl font-bold text-indigo-400 mb-2">
        {percent}%
      </div>
      <p className="text-slate-300 mb-6">
        {correctCount} out of {totalCount} correct
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium"
        >
          Retry
        </button>
        <button
          onClick={onBackToSubjects}
          className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 font-medium"
        >
          Back to subjects
        </button>
      </div>
    </div>
  );
}
