import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAtom } from '../../src/core/atom';

// Simple localStorage mock
const mockStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
};

// Set up mock
const localStorage = mockStorage();
Object.defineProperty(window, 'localStorage', { value: localStorage });

describe('createAtom', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('creates atom with initial value', () => {
    const atom = createAtom(42);
    expect(atom.get()).toBe(42);
  });

  it('updates value', () => {
    const atom = createAtom(0);
    atom.set(5);
    expect(atom.get()).toBe(5);
  });

  it('updates with function', () => {
    const atom = createAtom(10);
    atom.set(prev => prev + 5);
    expect(atom.get()).toBe(15);
  });

  it('notifies subscribers', () => {
    const atom = createAtom(0);
    const listener = vi.fn();

    atom.subscribe(listener);
    atom.set(5);

    expect(listener).toHaveBeenCalledWith(5);
  });

  it('does not notify when value is same', () => {
    const atom = createAtom(5);
    const listener = vi.fn();

    atom.subscribe(listener);
    atom.set(5);

    expect(listener).not.toHaveBeenCalled();
  });

  it('unsubscribes correctly', () => {
    const atom = createAtom(0);
    const listener = vi.fn();

    const unsubscribe = atom.subscribe(listener);
    unsubscribe();
    atom.set(5);

    expect(listener).not.toHaveBeenCalled();
  });

  it('persists to localStorage', () => {
    const atom = createAtom('initial', { persist: 'test-key' });
    atom.set('updated');

    expect(localStorage.getItem('test-key')).toBe('"updated"');
  });

  it('loads from localStorage', () => {
    localStorage.setItem('test-key', '"persisted"');
    const atom = createAtom('initial', { persist: 'test-key' });

    expect(atom.get()).toBe('persisted');
  });

  it('handles invalid JSON gracefully', () => {
    localStorage.setItem('test-key', 'invalid-json');
    const atom = createAtom('fallback', { persist: 'test-key' });

    expect(atom.get()).toBe('fallback');
  });

  it('handles circular references', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const circular: any = { name: 'test' };
    circular.self = circular;

    const atom = createAtom({ name: 'initial' }, { persist: 'test-key' });
    atom.set(circular);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Cannot persist non-serializable value'),
    );

    consoleSpy.mockRestore();
  });

  it('works with complex objects', () => {
    const atom = createAtom({ count: 0, name: 'test' });

    atom.set(prev => ({ ...prev, count: prev.count + 1 }));

    expect(atom.get().count).toBe(1);
    expect(atom.get().name).toBe('test');
  });
});
