import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { defineComponent, definePlugin, h, inject } from '../index';

describe('react', () => {
    describe('definePlugin()', () => {
        it('should create a new higher order component', () => {
            const Plugin = definePlugin(() => {});
            const Component = defineComponent({
                render () {
                    return h('div', {}, 'Hello world!');
                }
            });

            const wrapper = render(h(Plugin, {}, h(Component)) as any);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should be called with plugin options', () => {
            const pluginOptions = {
                color: 'light'
            };

            const Plugin = definePlugin((options) => {
                expect(options).toEqual(pluginOptions);
            });
            const Component = defineComponent({
                render () {
                    return h('div', {}, 'Hello world!');
                }
            });

            render(h(Plugin, { options: pluginOptions }, h(Component)) as any);
        });

        it('should provide data to children', () => {
            const provideSymbol = Symbol('provide');
            const provideData = { color: 'light' };

            const Plugin = definePlugin((options, { provide }) => {
                provide(provideSymbol, provideData);
            });
            const Component = defineComponent({
                setup () {
                    const data = inject(provideSymbol);

                    return { data };
                },
                render ({ data }) {
                    return h('div', {}, data?.color);
                }
            });

            const wrapper = render(h(Plugin, {}, h(Component)) as any);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });
    });
});
