import { useCallback, useSyncExternalStore } from 'react';
import type { Atom, AtomSetter, AtomUpdater } from '../types';

export function useAtom<T>(
  atom: Atom<T>,
): [T, AtomSetter<T>] {
  const value = useSyncExternalStore(
    atom.subscribe,
    atom.get,
    atom.get,
  );

  const setValue = useCallback(
    (newValue: AtomUpdater<T>) => {
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
): AtomSetter<T> {
  return useCallback(
    (newValue: AtomUpdater<T>) => {
      atom.set(newValue);
    },
    [atom],
  );
}
