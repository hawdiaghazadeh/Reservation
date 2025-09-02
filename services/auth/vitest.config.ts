
import {defineConfig} from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        clearMocks: true,
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.test.ts'],
            all: true,
            thresholds: {
                statements: 80,
                branches: 80,
                functions: 80,
                lines: 80,
            },
        },
    }
})