import { useCallback, useEffect, useState } from "react";

export interface SubjectProgress {
  attempted: number;
  correct: number;
  lastScorePercent: number | null;
}

type ProgressMap = Record<string, SubjectProgress>;

const STORAGE_KEY = "exam-review-progress";

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
  }, [progress]);

  const recordAttempt = useCallback(
    (subjectId: string, correctCount: number, totalCount: number) => {
      setProgress((prev) => {
        const prevEntry = prev[subjectId] ?? {
          attempted: 0,
          correct: 0,
          lastScorePercent: null,
        };
        return {
          ...prev,
          [subjectId]: {
            attempted: prevEntry.attempted + totalCount,
            correct: prevEntry.correct + correctCount,
            lastScorePercent: Math.round((correctCount / totalCount) * 100),
          },
        };
      });
    },
    []
  );

  const resetSubject = useCallback((subjectId: string) => {
    setProgress((prev) => {
      const next = { ...prev };
      delete next[subjectId];
      return next;
    });
  }, []);

  return { progress, recordAttempt, resetSubject };
}
