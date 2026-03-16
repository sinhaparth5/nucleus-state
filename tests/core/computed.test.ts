import { describe, expect, it, vi } from 'vitest';
import { createAtom } from '../../src/core/atom';
import { createComputed } from '../../src/core/computed';
import type { ReadonlyAtom } from '../../src/types';

describe('createComputed', () => {
  it('computes the initial value immediately', () => {
    const countAtom = createAtom(2);
    const doubledAtom = createComputed([countAtom], () => countAtom.get() * 2);

    expect(doubledAtom.get()).toBe(4);
  });

  it('recomputes when a dependency changes', () => {
    const firstNameAtom = createAtom('Parth');
    const lastNameAtom = createAtom('Sinha');
    const fullNameAtom = createComputed(
      [firstNameAtom, lastNameAtom],
      () => `${firstNameAtom.get()} ${lastNameAtom.get()}`,
    );

    firstNameAtom.set('Pat');

    expect(fullNameAtom.get()).toBe('Pat Sinha');
  });

  it('recomputes on get even without active subscribers', () => {
    const countAtom = createAtom(2);
    const doubledAtom = createComputed([countAtom], () => countAtom.get() * 2);

    countAtom.set(4);

    expect(doubledAtom.get()).toBe(8);
  });

  it('notifies subscribers only when the computed value changes', () => {
    const countAtom = createAtom(1);
    const parityAtom = createComputed([countAtom], () => countAtom.get() % 2);
    const listener = vi.fn();

    parityAtom.subscribe(listener);

    countAtom.set(3);
    countAtom.set(5);
    countAtom.set(6);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(0);
  });

  it('throws when trying to set a computed atom', () => {
    const countAtom = createAtom(1);
    const doubledAtom = createComputed([countAtom], () => countAtom.get() * 2);

    expect(() => doubledAtom.set(10)).toThrow('Cannot set value on computed atom');
  });

  it('stops notifying unsubscribed computed listeners', () => {
    const countAtom = createAtom(1);
    const doubledAtom = createComputed([countAtom], () => countAtom.get() * 2);
    const listener = vi.fn();

    const unsubscribe = doubledAtom.subscribe(listener);
    unsubscribe();

    countAtom.set(2);

    expect(listener).not.toHaveBeenCalled();
  });

  it('starts and stops dependency subscriptions with listener lifecycle', () => {
    const dependencyListeners = new Set<() => void>();
    const dependencyUnsubscribe = vi.fn();
    const dependencyAtom: ReadonlyAtom<number> = {
      get: () => 1,
      subscribe: vi.fn(listener => {
        dependencyListeners.add(listener);
        return () => {
          dependencyListeners.delete(listener);
          dependencyUnsubscribe();
        };
      }),
    };

    const computedAtom = createComputed([dependencyAtom], () => dependencyAtom.get() * 2);

    expect(dependencyAtom.subscribe).not.toHaveBeenCalled();

    const unsubscribe = computedAtom.subscribe(vi.fn());
    expect(dependencyAtom.subscribe).toHaveBeenCalledTimes(1);
    expect(dependencyListeners.size).toBe(1);

    unsubscribe();
    expect(dependencyUnsubscribe).toHaveBeenCalledTimes(1);
    expect(dependencyListeners.size).toBe(0);
  });
});
