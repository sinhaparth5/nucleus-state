export interface Atom<T> {
  get(): T;
  set(value: T | ((prev: T) => T)): void;
  subscribe(listener: (value: T) => void): () => void;
}

export interface AtomOptions {
  name?: string;
  persist?: string;
}

export type AtomListner<T> = (value: T) => void;
export type AtomSetter<T> = (value: T | ((prev: T) => T)) => void;
epxort type AtomGetter<T> = () => T;
