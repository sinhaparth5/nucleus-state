import type { Atom } from '../types';

export function createComputed<T>(
  computeFn: () => T
): Atom<T> {
  let value = computeFn();
  const listeners = new Set<(value: T) => void>();
  
  // TODO: Add dependency tracking in future versions
  
  return {
    get(): T {
      return value;
    },
    
    set(): void {
      throw new Error('Cannot set value on computed atom');
    },
    
    subscribe(listener: (value: T) => void): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }
  };
}
