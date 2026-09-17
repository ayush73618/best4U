/**
 * Minimal localStorage read/write with JSON serialization and safe
 * fallbacks. Shared by Work's To-dos/Notes/Habits now, and any future
 * feature that needs simple local persistence before the backend exists.
 */
export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}