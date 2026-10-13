import { useCallback, useEffect, useState } from "react";
import type { ExamPeriod } from "../types/quiz";

export interface SubjectProgress {
  attempted: number;
  correct: number;
  lastScorePercent: number | null;
}

type ProgressMap = Record<string, SubjectProgress>;

const LEGACY_KEY = "exam-review-progress";

function storageKeyFor(profileName: string, period: ExamPeriod = "midterm"): string {
  return `${LEGACY_KEY}:${profileName}:${period}`;
}

function legacyKeyFor(profileName: string): string {
  return `${LEGACY_KEY}:${profileName}`;
}

function loadProgress(key: string, fallbackKey?: string): ProgressMap {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as ProgressMap;
    if (fallbackKey) {
      const fallbackRaw = localStorage.getItem(fallbackKey);
      if (fallbackRaw) return JSON.parse(fallbackRaw) as ProgressMap;
    }
    return {};
  } catch {
    return {};
  }
}

export function useProgress(
  profileName: string | null,
  period: ExamPeriod = "midterm"
) {
  const key = profileName ? storageKeyFor(profileName, period) : null;
  const legacyKey =
    profileName && period === "midterm" ? legacyKeyFor(profileName) : undefined;

  const [progress, setProgress] = useState<ProgressMap>(() => {
    if (!key || !profileName) return {};
    return loadProgress(key, legacyKey);
  });

  // Reload whenever active profile or exam period changes
  useEffect(() => {
    if (!key || !profileName) {
      setProgress({});
      return;
    }
    setProgress(loadProgress(key, legacyKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, period]);

  useEffect(() => {
    if (!key) return;
    try {
      localStorage.setItem(key, JSON.stringify(progress));
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
  }, [key, progress]);

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