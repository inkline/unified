import { describe, it, expect } from 'vitest';
import { defineComponent, h, inject, provide, ref } from '../index';
import { fireEvent, render } from '@testing-library/react';

describe('react', () => {
    describe('provide/inject()', () => {
        it('should provide data to children', async () => {
            const identifier = Symbol('provide-reactive');
            const Provider = defineComponent({
                setup (props, ctx) {
                    ctx.provide(identifier, 'value');

                    return {};
                },
                render (state, ctx) {
                    return <div>{ctx.slot()}</div>;
                }
            });

            const Consumer = defineComponent({
                setup (props, ctx) {
                    const providedValue = ctx.inject(identifier);

                    return { providedValue };
                },
                render (state) {
                    return <div>{state.providedValue}</div>;
                }
            });

            const wrapper = render(<Provider>
                <Consumer key={'consumer'} />
            </Provider>);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should provide reactive data to children', async () => {
            const identifier = Symbol('provide-reactive');
            const Provider = defineComponent({
                setup (props, ctx) {
                    const count = ref(0);
                    const onClick = () => { count.value += 1; };

                    ctx.provide(identifier, count, [count.value]);

                    return { onClick };
                },
                render (state, ctx) {
                    return <button onClick={state.onClick}>{ctx.slot()}</button>;
                }
            });

            const Consumer = defineComponent({
                setup (props, ctx) {
                    const providedValue = ctx.inject(identifier);

                    return { providedValue };
                },
                render (state) {
                    return <div>{state.providedValue?.value}</div>;
                }
            });

            const wrapper = render(<Provider>
                <Consumer key={'consumer'} />
            </Provider>);
            await fireEvent.click(wrapper.container.firstChild as Element);
            expect(await wrapper.findByText('1')).toBeTruthy();
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should provide reactive data based on id', async () => {
            const Provider = defineComponent({
                setup (props, ctx) {
                    const text = ref(props.id);
                    const onClick = () => { text.value = 'abc'; };

                    ctx.provide(props.id, text);

                    return { onClick };
                },
                render (state, ctx) {
                    return <button onClick={state.onClick}>{ctx.slot()}</button>;
                }
            });

            const Consumer = defineComponent({
                setup (props, ctx) {
                    const providedValue = ctx.inject(props.id);

                    return { providedValue };
                },
                render (state) {
                    return <div>{state.providedValue?.value}</div>;
                }
            });

            const wrapper = render(<div>
                <Provider id={'a'}>
                    <Consumer id={'a'} />
                </Provider>
                <Provider id={'b'}>
                    <Consumer id={'b'}/>
                </Provider>
            </div>);

            const buttons = wrapper.container.querySelectorAll('button');
            expect(wrapper.container.firstChild).toMatchSnapshot();
            await fireEvent.click(buttons[0] as Element);
            expect(wrapper.container.firstChild).toMatchSnapshot();
            await fireEvent.click(buttons[1] as Element);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });
    });
});
