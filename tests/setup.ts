import '@testing-library/jest-dom';

// Add any global test setup here
if (typeof window !== 'undefined') {
  // Mock localStorage for tests
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string): string | null => store[key] ?? null,
      setItem: (key: string, value: string): void => {
        store[key] = value;
      },
      removeItem: (key: string): void => {
        delete store[key];
      },
      clear: (): void => {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock,
  });
}
