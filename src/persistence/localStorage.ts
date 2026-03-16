import { createAtom } from '../core';
import type { AtomOptions } from '../types';

function getLocalStorage(): Storage | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.localStorage;
}

function getSessionStorage(): Storage | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.sessionStorage;
}

export function createPersistedAtom<T>(
  initialValue: T,
  key: string,
  options: Omit<AtomOptions, 'persist'> = {},
) {
  return createAtom(initialValue, {
    ...options,
    persist: key,
    storage: options.storage ?? getLocalStorage(),
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
    storage: options.storage ?? getSessionStorage(),
  });
}
