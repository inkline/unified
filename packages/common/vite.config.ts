import { defineConfig } from 'vite';
import { resolve } from 'path';
import { configDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [],
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        jsxInject: ''
    },
    resolve: {
        alias: [
            {
                find: /^@inkline\/paper\//,
                replacement: `${resolve(__dirname)}/src/`
            }
        ]
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src', 'index.ts'),
            name: 'InklinePaperVue',
            fileName: (format) => `vue.${format}.js`
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: [
                'vue'
            ],
            output: {
                exports: 'named',
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: 'Vue'
                }
            }
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'lib/**']
    }
});
