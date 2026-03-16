import { describe, expect, it, vi } from 'vitest';
import { createAtom } from '../../src/core/atom';
import { createComputed } from '../../src/core/computed';

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
});
