export interface PersistStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}

export type AtomUpdater<T> = T | ((prev: T) => T);
export type AtomListener<T> = (value: T) => void;
export type AtomGetter<T> = () => T;
export type AtomSetter<T> = (value: AtomUpdater<T>) => void;
export type Unsubscribe = () => void;

export interface ReadonlyAtom<T> {
  get(): T;
  subscribe(listener: AtomListener<T>): Unsubscribe;
}

export interface Atom<T> {
  get(): T;
  set(value: AtomUpdater<T>): void;
  subscribe(listener: AtomListener<T>): Unsubscribe;
}

export interface AtomOptions {
  name?: string;
  persist?: string;
  storage?: PersistStorage;
}
