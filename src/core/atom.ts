import type { Atom, AtomOptions, AtomListener, Unsubscribe } from '../types';
import { isFunction, tryParseJSON, isSerializable } from '../utils';

// Global atom registry for devtools
const atomRegistry = new Map<string, Atom<any>>();
let atomCounter = 0;

// Expose devtools in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__NUCLEUS_ATOMS__ = {
    get: (name: string) => atomRegistry.get(name)?.get(),
    set: (name: string, value: any) => atomRegistry.get(name)?.set(value),
    list: () => Array.from(atomRegistry.keys()),
    registry: atomRegistry,
  };
}

export function createAtom<T>(
  initialValue: T,
  options: AtomOptions = {}
): Atom<T> {
  const { name, persist, storage = localStorage } = options;

  // Generate unique atom ID
  const atomId = name || `atom_${++atomCounter}`;

  // Try to load persited value
  let value = initialValue;
  if (persist && typeof window !== 'undefined') {
    try {
      const stored = storage.getItem(persist);
      if (stored !== null) {
        const parsed = tryParseJSON<T>(stored);
        if (parsed !== null) {
          value = parsed;
        }
      }
    } catch (error) {
      console.warn(`Failed to load persisted atom "${atomId}": `, error);
    }
  }

  const listeners = new Set<AtomListener<T>>();
  
  const atom: Atom<T> = {
    get(): T {
      return value;
    },

    set(newValue: T | ((prev: T) => T)): void {
      const nextValue = isFunction(newValue) ? newValue(value) : newValue;

      if (Object.is(nextValue, value)) {
        return;
      }

      value = nextValue;

      if (persist && typeof window !== 'undefined') {
        try {
          if (isSerializable(value)) {
            storage.setItem(persist, JSON.stringify(value));
          } else {
            console.warn(`Cannot persist non-serializable value in atom "${atomId}"`);
          }
        } catch (error) {
          console.warn(`Failed to persist atom "${atomId}":`, error);
        }
      }

      // Notify all subscribers
      listeners.forEach(listener => {
        try {
          listener(value);
        } catch (error) {
          console.error('Error in atom listener:', error);
        }
      });
    },

    subscribe(listener: AtomListener<T>): Unsubscribe {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };

  // Register atom for devtools
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    atomRegistry.set(atomId, atom);
    (atom as any).__debugName = atomId;
  }

  return atom;
}
