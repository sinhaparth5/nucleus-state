import type { Atom, AtomListener, ReadonlyAtom, Unsubscribe } from '../types';

type DependencyAtom = ReadonlyAtom<unknown>;

function notifyListeners<T>(listeners: Set<AtomListener<T>>, value: T): void {
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

  const listeners = new Set<AtomListener<T>>();
  const dependencyUnsubscribes = new Set<Unsubscribe>();
  let value = computeFn();
  let isTrackingDependencies = false;

  const recompute = (shouldNotifyListeners: boolean): T => {
    const nextValue = computeFn();
    if (Object.is(nextValue, value)) {
      return value;
    }

    value = nextValue;

    if (shouldNotifyListeners) {
      notifyListeners(listeners, value);
    }

    return value;
  };

  const handleDependencyChange = () => {
    recompute(true);
  };

  const startTrackingDependencies = (): void => {
    if (isTrackingDependencies || dependencies.length === 0) {
      return;
    }

    dependencies.forEach(dependency => {
      dependencyUnsubscribes.add(dependency.subscribe(handleDependencyChange));
    });
    isTrackingDependencies = true;
  };

  const stopTrackingDependencies = (): void => {
    if (!isTrackingDependencies) {
      return;
    }

    dependencyUnsubscribes.forEach(unsubscribe => unsubscribe());
    dependencyUnsubscribes.clear();
    isTrackingDependencies = false;
  };

  const atom: Atom<T> = {
    get(): T {
      if (!isTrackingDependencies && dependencies.length > 0) {
        return recompute(false);
      }

      return value;
    },

    set(): void {
      throw new Error('Cannot set value on computed atom');
    },

    subscribe(listener: AtomListener<T>) {
      if (listeners.size === 0) {
        startTrackingDependencies();
        recompute(false);
      }

      listeners.add(listener);

      return () => {
        listeners.delete(listener);

        if (listeners.size === 0) {
          stopTrackingDependencies();
        }
      };
    },
  };
  return atom;
}
