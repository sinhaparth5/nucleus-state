import { createAtom } from '../core';
import type { AtomOptions } from '../types';

export function createPersistedAtom<T>(
  initialValue: T,
  key: string,
  options: Omit<AtomOptions, 'persist'> = {},
) {
  return createAtom(initialValue, {
    ...options,
    persist: key,
    storage: localStorage,
  });
}

export function createSessionAtom<T>(
  initialValue: T,
  key: string,
  options: Omit<AtomOptions, 'persist'> = {},
) {
  return createAtom(initialValue, {
    ...options,
    persist: key,
    storage: sessionStorage,
  });
}
