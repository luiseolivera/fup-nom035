import { useState } from "react";

export function useStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  function set(newValue) {
    const resolved =
      typeof newValue === "function" ? newValue(value) : newValue;
    setValue(resolved);
    try {
      localStorage.setItem(key, JSON.stringify(resolved));
    } catch {
      // storage full or blocked
    }
  }

  return [value, set];
}
