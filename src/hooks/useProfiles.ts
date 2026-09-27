import { useCallback, useEffect, useState } from "react";

const PROFILES_KEY = "exam-review-profiles";
const ACTIVE_PROFILE_KEY = "exam-review-active-profile";
const PROGRESS_PREFIX = "exam-review-progress:";

function loadProfiles(): string[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function loadActiveProfile(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PROFILE_KEY);
  } catch {
    return null;
  }
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<string[]>(() => loadProfiles());
  const [activeProfile, setActiveProfileState] = useState<string | null>(() =>
    loadActiveProfile()
  );

  useEffect(() => {
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    } catch {
      // ignore storage errors
    }
  }, [profiles]);

  useEffect(() => {
    try {
      if (activeProfile) {
        localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfile);
      } else {
        localStorage.removeItem(ACTIVE_PROFILE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, [activeProfile]);

  const selectProfile = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setProfiles((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setActiveProfileState(trimmed);
  }, []);

  const switchToGate = useCallback(() => {
    setActiveProfileState(null);
  }, []);

  // Removes the profile from the list AND deletes its saved progress —
  // deleting a name shouldn't leave orphaned quiz data behind.
  const deleteProfile = useCallback(
    (name: string) => {
      try {
        localStorage.removeItem(`${PROGRESS_PREFIX}${name}`);
      } catch {
        // ignore storage errors
      }
      setProfiles((prev) => prev.filter((p) => p !== name));
      if (activeProfile === name) {
        setActiveProfileState(null);
      }
    },
    [activeProfile]
  );

  return { profiles, activeProfile, selectProfile, switchToGate, deleteProfile };
}