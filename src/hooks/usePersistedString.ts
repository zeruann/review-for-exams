import { useEffect, useState } from "react";

export function usePersistedString(key: string, defaultValue: string) {
  const [value, setValue] = useState<string>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? defaultValue : raw;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore storage errors
    }
  }, [key, value]);

  return [value, setValue] as const;
}