import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'oid4vc-verifier-endpoint-core',
      fileName: 'index',
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
