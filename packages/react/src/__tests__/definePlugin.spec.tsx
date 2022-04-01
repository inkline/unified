import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { defineComponent, definePlugin, h } from '../index';

describe('react', () => {
    describe('definePlugin()', () => {
        it('should create a new higher order component', () => {
            const Plugin = definePlugin(() => {});
            const Component = defineComponent({
                render () {
                    return <div>Hello world!</div>;
                }
            });

            const wrapper = render(<Plugin><Component /></Plugin>);
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
                    return <div>Hello world!</div>;
                }
            });

            render(<Plugin options={pluginOptions}><Component /></Plugin>);
        });

        it('should provide data to children', () => {
            const provideSymbol = Symbol('provide');
            const provideData = { color: 'light' };

            const Plugin = definePlugin((options, { provide }) => {
                provide(provideSymbol, provideData);
            });
            const Component = defineComponent({
                setup (props, { inject }) {
                    const data = inject(provideSymbol);

                    return { data };
                },
                render ({ data }) {
                    return <div>{data?.color}</div>;
                }
            });

            const wrapper = render(<Plugin><Component /></Plugin>);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });
    });
});
