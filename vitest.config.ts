
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "client", "src"),
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['client/src/__tests__/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    },
});
