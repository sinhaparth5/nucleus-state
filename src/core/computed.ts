import type { Atom } from '../types';

export function createComputed<T>(computeFn: () => T): Atom<T> {
  let value = computeFn();
  let isStale = false;
  const listeners = new Set<(value: T) => void>();

  const atom: Atom<T> = {
    get(): T {
      if (isStale) {
        const newValue = computeFn();
        if (!Object.is(newValue, value)) {
          value = newValue;
          listeners.forEach(listener => listener(value));
        }
        isStale = false;
      }
      return value;
    },

    set(): void {
      throw new Error('Cannot set value on computed atom');
    },

    subscribe(listener: (value: T) => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
  return atom;
}