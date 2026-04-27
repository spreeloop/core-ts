import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: [
    'firebase',
    'firebase/app',
    'firebase/firestore',
    'firebase-admin',
    'firebase-admin/firestore',
    'firebase-admin/lib/firestore',
  ],
});