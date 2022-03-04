import { defineConfig } from 'vite';
import { resolve } from 'path';
// import vue from '@vitejs/plugin-vue';
// import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        // react(),
        // vue()
    ],
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
            entry: resolve(__dirname, 'src', 'react', 'index.ts'),
            name: 'InklinePaper',
            fileName: (format) => `paper.${format}.js`
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: [
                'react',
                'vue'
            ],
            output: {
                exports: 'named',
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    react: 'React',
                    vue: 'Vue'
                }
            }
        }
    },
    test: {
        globals: true,
        environment: 'jsdom'
    }
});
