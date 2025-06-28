import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  external: ['react'],
  target: 'es2018',
  bundle: true,
  treeshake: true,
  outDir: 'dist',
  cjsInterop: true,
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.js' : '.mjs'
    };
  },
});
