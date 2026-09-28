import { useCallback, useEffect, useState } from "react";

export interface SubjectProgress {
  attempted: number;
  correct: number;
  lastScorePercent: number | null;
}

type ProgressMap = Record<string, SubjectProgress>;

const LEGACY_KEY = "exam-review-progress";
const MIGRATION_FLAG_KEY = "exam-review-legacy-migrated";

function storageKeyFor(profileName: string): string {
  return `${LEGACY_KEY}:${profileName}`;
}

function loadProgress(key: string): ProgressMap {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

// Runs at most once per device, ever. If pre-profile progress exists under
// the old key, it's adopted by whichever profile is created first; every
// later profile just starts fresh.
function migrateLegacyIfNeeded(profileName: string): ProgressMap | null {
  try {
    if (localStorage.getItem(MIGRATION_FLAG_KEY)) return null;
    localStorage.setItem(MIGRATION_FLAG_KEY, "true");

    const legacyRaw = localStorage.getItem(LEGACY_KEY);
    if (!legacyRaw) return null;

    const legacyData = JSON.parse(legacyRaw) as ProgressMap;
    if (!legacyData || Object.keys(legacyData).length === 0) return null;

    localStorage.setItem(storageKeyFor(profileName), legacyRaw);
    return legacyData;
  } catch {
    return null;
  }
}

export function useProgress(profileName: string | null) {
  const key = profileName ? storageKeyFor(profileName) : null;

  const [progress, setProgress] = useState<ProgressMap>(() => {
    if (!key || !profileName) return {};
    return loadProgress(key);
  });

  // Reload whenever the active profile changes (switching users).
  useEffect(() => {
    if (!key || !profileName) {
      setProgress({});
      return;
    }
     setProgress(loadProgress(key));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

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