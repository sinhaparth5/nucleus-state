import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  spliting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  external: ['react'],
  target: 'es2018',
  bundle: true,
  treeshake: true
});
