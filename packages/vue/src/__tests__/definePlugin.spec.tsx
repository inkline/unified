import { describe, it, expect } from 'vitest';
import { definePlugin } from '../index';
import { createApp } from 'vue';

describe('vue', () => {
    describe('definePlugin()', () => {
        it('should create a new vue plugin', () => {
            const Plugin = definePlugin(() => {});

            expect(Plugin).toHaveProperty('install');
            expect(Plugin.install).toBeInstanceOf(Function);
        });

        it('should be installable', () => {
            const app = createApp({});
            const Inkline = definePlugin(() => {});

            expect(() => app.use(Inkline)).not.toThrow();
        });

        it('should pass plugin options', () => {
            const pluginOptions = { color: 'light' };
            const app = createApp({});
            const Inkline = definePlugin((options) => {
                expect(options).toEqual(pluginOptions);
            });

            app.use(Inkline, pluginOptions);
        });

        it('should provide data to children', () => {
            const provideSymbol = Symbol('provided');
            const provideData = { color: 'light' };

            const app = createApp({});
            const Inkline = definePlugin((options, { provide }) => {
                provide(provideSymbol, provideData);
            });

            app.use(Inkline);

            expect(app.config.globalProperties).toHaveProperty(`$${provideSymbol.description}`, provideData);
        });
    });
});
