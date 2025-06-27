import { useCallback, useSyncExternalStore } from 'react';
import type { Atom } from '../types';

export function useAtom<T>(
  atom: Atom<T>,
): [T, (value: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    atom.subscribe,
    atom.get,
    atom.get,
  );

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      atom.set(newValue);
    },
    [atom],
  );

  return [value, setValue];
}

export function useAtomValue<T>(atom: Atom<T>): T {
  return useSyncExternalStore(
    atom.subscribe,
    atom.get,
    atom.get,
  );
}

export function useSetAtom<T>(
  atom: Atom<T>,
): (value: T | ((prev: T) => T)) => void {
  return useCallback(
    (newValue: T | ((prev: T) => T)) => {
      atom.set(newValue);
    },
    [atom],
  );
}
