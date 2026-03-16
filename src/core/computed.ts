import type { Atom } from '../types';

interface ReadableAtom<T> {
  get(): T;
  subscribe(listener: (value: T) => void): () => void;
}

type DependencyAtom = ReadableAtom<unknown>;

function notifyListeners<T>(listeners: Set<(value: T) => void>, value: T): void {
  listeners.forEach(listener => listener(value));
}

export function createComputed<T>(
  computeFnOrDependencies: (() => T) | readonly DependencyAtom[],
  maybeComputeFn?: () => T,
): Atom<T> {
  let dependencies: readonly DependencyAtom[] = [];
  let computeFn: () => T;

  if (typeof computeFnOrDependencies === 'function') {
    computeFn = computeFnOrDependencies;
  } else {
    if (!maybeComputeFn) {
      throw new Error('createComputed requires a compute function');
    }

    dependencies = computeFnOrDependencies;
    computeFn = maybeComputeFn;
  }

  const listeners = new Set<(value: T) => void>();
  let value = computeFn();

  if (dependencies.length > 0) {
    dependencies.forEach(dependency => {
      dependency.subscribe(() => {
        const nextValue = computeFn();
        if (Object.is(nextValue, value)) {
          return;
        }

        value = nextValue;
        notifyListeners(listeners, value);
      });
    });
  }

  const atom: Atom<T> = {
    get(): T {
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
