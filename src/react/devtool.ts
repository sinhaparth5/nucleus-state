import type { Atom } from '../types';

export interface NucleusDevtools {
  get(name: string): unknown;
  set(name: string, value: unknown): void;
  list(): string[];
  registry: Map<string, Atom<unknown>>;
}

declare global {
  interface Window {
    __NUCLEUS_ATOMS__?: NucleusDevtools;
  }
}

export {};
