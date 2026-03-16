import type { Atom, AtomOptions, AtomListener, PersistStorage, Unsubscribe } from '../types';
import { isFunction, tryParseJSON, isSerializable } from '../utils';

// Global atom registry for devtools
const atomRegistry = new Map<string, Atom<unknown>>();
let atomCounter = 0;

function getBrowserStorage(storage?: PersistStorage): PersistStorage | undefined {
  if (storage) {
    return storage;
  }

  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.localStorage;
}

// Expose devtools in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as unknown as { __NUCLEUS_ATOMS__: unknown }).__NUCLEUS_ATOMS__ = {
    get: (name: string) => atomRegistry.get(name)?.get(),
    set: (name: string, value: unknown) => atomRegistry.get(name)?.set(value),
    list: () => Array.from(atomRegistry.keys()),
    registry: atomRegistry,
  };
}

export function createAtom<T>(
  initialValue: T,
  options: AtomOptions = {},
): Atom<T> {
  const { name, persist } = options;
  const storage = getBrowserStorage(options.storage);

  // Generate unique atom ID
  const atomId = name ?? `atom_${++atomCounter}`;

  // Try to load persisted value
  let value = initialValue;
  if (persist && storage) {
    try {
      const stored = storage.getItem(persist);
      if (stored !== null) {
        const parsed = tryParseJSON<T>(stored);
        if (parsed !== null) {
          value = parsed;
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Failed to load persisted atom "${atomId}":`, error);
    }
  }

  const listeners = new Set<AtomListener<T>>();

  const notifyListeners = (): void => {
    listeners.forEach(listener => {
      try {
        listener(value);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in atom listener:', error);
      }
    });
  };

  const persistValue = (): void => {
    if (!persist || !storage) {
      return;
    }

    try {
      if (isSerializable(value)) {
        storage.setItem(persist, JSON.stringify(value));
      } else {
        // eslint-disable-next-line no-console
        console.warn(`Cannot persist non-serializable value in atom "${atomId}"`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Failed to persist atom "${atomId}":`, error);
    }
  };

  const setValue = (nextValue: T): void => {
    if (Object.is(nextValue, value)) {
      return;
    }

    value = nextValue;
    persistValue();
    notifyListeners();
  };

  const atom: Atom<T> = {
    get(): T {
      return value;
    },

    set(newValue: T | ((prev: T) => T)): void {
      const nextValue = isFunction(newValue) ? newValue(value) : newValue;
      setValue(nextValue);
    },

    reset(): void {
      setValue(initialValue);
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
    atomRegistry.set(atomId, atom as Atom<unknown>);
    (atom as Atom<T> & { __debugName?: string }).__debugName = atomId;
  }

  return atom;
}
