import { afterEach, describe, expect, it, vi } from 'vitest';

describe('devtools exposure', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    delete window.__NUCLEUS_ATOMS__;
  });

  it('exposes devtools in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.resetModules();

    const { createAtom } = await import('../../src/core/atom');

    createAtom(1, { name: 'count' });

    expect(window.__NUCLEUS_ATOMS__).toBeDefined();
    expect(window.__NUCLEUS_ATOMS__?.list()).toContain('count');
    expect(window.__NUCLEUS_ATOMS__?.get('count')).toBe(1);
  });

  it('does not expose devtools outside development', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.resetModules();

    await import('../../src/core/atom');

    expect(window.__NUCLEUS_ATOMS__).toBeUndefined();
  });
});
