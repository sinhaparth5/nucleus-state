export interface Atom<T> {
  get(): T;
  set(value: T | ((prev: T) => T)): void;
  subscribe(listener: (value: T) => void): () => void;
}

export interface AtomOptions {
  name?: string;
  persist?: string;
  storage?: Storage;
}

export type AtomListener<T> = (value: T) => void;
export type AtomSetter<T> = (value: T | ((prev: T) => T)) => void;
export type AtomGetter<T> = () => T;
export type Unsubscribe = () => void;
