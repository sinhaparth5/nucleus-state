import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createAtom } from '../../src/core/atom';
import { useAtom, useAtomValue, useSetAtom } from '../../src/react/hooks';

describe('React hooks', () => {
  describe('useAtom', () => {
    it('should return current value and setter', () => {
      const atom = createAtom(0);
      const { result } = renderHook(() => useAtom(atom));

      expect(result.current[0]).toBe(0);
      expect(typeof result.current[1]).toBe('function');
    });

    it('should update when atom value changes', () => {
      const atom = createAtom(0);
      const { result } = renderHook(() => useAtom(atom));

      act(() => {
        result.current[1](5);
      });

      expect(result.current[0]).toBe(5);
    });

    it('should work with functional updates', () => {
      const atom = createAtom(10);
      const { result } = renderHook(() => useAtom(atom));

      act(() => {
        result.current[1](prev => prev * 2);
      });

      expect(result.current[0]).toBe(20);
    });
  });

  describe('useAtomValue', () => {
    it('should return current value', () => {
      const atom = createAtom('hello');
      const { result } = renderHook(() => useAtomValue(atom));

      expect(result.current).toBe('hello');
    });

    it('should update when atom changes externally', () => {
      const atom = createAtom('initial');
      const { result } = renderHook(() => useAtomValue(atom));

      act(() => {
        atom.set('updated');
      });

      expect(result.current).toBe('updated');
    });
  });

  describe('useSetAtom', () => {
    it('should return setter function', () => {
      const atom = createAtom(0);
      const { result } = renderHook(() => useSetAtom(atom));

      expect(typeof result.current).toBe('function');
    });

    it('should update atom when called', () => {
      const atom = createAtom(0);
      const { result } = renderHook(() => useSetAtom(atom));

      act(() => {
        result.current(42);
      });

      expect(atom.get()).toBe(42);
    });
  });
});
