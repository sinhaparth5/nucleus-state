import type { Atom, AtomOptions, AtomListener } from '../types';

export function createAtom<T>(
  initialValue: T,
  options: AtomOptions = {}
): Atom<T> {
  let value = initialValue;
  const listeners = new Set<AtomListener<T>>();
  
  const atom: Atom<T> = {
    get(): T {
      return value;
    },
    
    set(newValue: T | ((prev: T) => T)): void {
      const nextValue = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(value)
        : newValue;
      
      if (nextValue !== value) {
        value = nextValue;
        listeners.forEach(listener => listener(value));
      }
    },
    
    subscribe(listener: AtomListener<T>): () => void {
      listeners.add(listener);
      
      // Return unsubscribe function
      return () => {
        listeners.delete(listener);
      };
    }
  };

  // Add debug name if provided
  if (options.name && typeof window !== 'undefined') {
    (atom as any).__debugName = options.name;
  }

  return atom;
}
