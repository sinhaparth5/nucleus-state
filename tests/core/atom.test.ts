import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAtom } from '../../src/core/atom';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('createAtom', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should create atom with initial value', () => {
    const atom = createAtom(42);
    expect(atom.get()).toBe(42);
  });

  it('should update value with direct assignment', () => {
    const atom = createAtom(0);
    atom.set(5);
    expect(atom.get()).toBe(5);
  });

  it('should update value with function', () => {
    const atom = createAtom(10);
    atom.set(prev => prev + 5);
    expect(atom.get()).toBe(15);
  });

  it('should notify subscribers when value changes', () => {
    const atom = createAtom(0);
    const listener = vi.fn();
    
    atom.subscribe(listener);
    atom.set(5);
    
    expect(listener).toHaveBeenCalledWith(5);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should not notify when value is the same', () => {
    const atom = createAtom(5);
    const listener = vi.fn();
    
    atom.subscribe(listener);
    atom.set(5);
    
    expect(listener).not.toHaveBeenCalled();
  });

  it('should handle multiple subscribers', () => {
    const atom = createAtom(0);
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    
    atom.subscribe(listener1);
    atom.subscribe(listener2);
    atom.set(10);
    
    expect(listener1).toHaveBeenCalledWith(10);
    expect(listener2).toHaveBeenCalledWith(10);
  });

  it('should unsubscribe correctly', () => {
    const atom = createAtom(0);
    const listener = vi.fn();
    
    const unsubscribe = atom.subscribe(listener);
    unsubscribe();
    atom.set(5);
    
    expect(listener).not.toHaveBeenCalled();
  });

  it('should persist value to localStorage', () => {
    const atom = createAtom('initial', { persist: 'test-key' });
    atom.set('updated');
    
    expect(localStorageMock.getItem('test-key')).toBe('"updated"');
  });

  it('should load persisted value from localStorage', () => {
    localStorageMock.setItem('test-key', '"persisted"');
    const atom = createAtom('initial', { persist: 'test-key' });
    
    expect(atom.get()).toBe('persisted');
  });

  it('should handle non-serializable values gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const atom = createAtom(() => {}, { persist: 'test-key' });
    
    atom.set(() => {});
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Cannot persist non-serializable value')
    );
    
    consoleSpy.mockRestore();
  });
});