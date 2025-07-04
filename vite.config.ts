import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
      exclude: ['**/*.spec.ts'],
    }),
  ],
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'oid4vc-verifier-endpoint-core',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === 'CIRCULAR_DEPENDENCY' &&
          !warning.message.includes('node_modules')
        ) {
          console.warn('Circular dependency detected:', warning.message);
        }
        warn(warning);
      },
    },
  },
});
