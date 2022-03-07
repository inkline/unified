import { describe, it, expect } from 'vitest';
import { defineComponent, h, inject, provide, ref } from '../index';
import { fireEvent, render } from '@testing-library/react';

describe('react', () => {
    describe('provide/inject()', () => {
        it('should provide data to children', async () => {
            const identifier = Symbol('provide-reactive');
            const Provider = defineComponent({
                setup (props, ctx) {
                    provide(identifier, 'value');

                    return {};
                },
                render (state, ctx) {
                    return h('div', {}, [
                        ctx.slot()
                    ]);
                }
            });

            const Consumer = defineComponent({
                setup (props, ctx) {
                    const providedValue = inject(identifier);

                    return { providedValue };
                },
                render (state) {
                    return h('div', {}, [
                        `${state.providedValue}`
                    ]);
                }
            });

            const wrapper = render(h(Provider, {}, [
                h(Consumer, { key: 'consumer' })
            ]) as any);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should provide reactive data to children', async () => {
            const identifier = Symbol('provide-reactive');
            const Provider = defineComponent({
                setup (props, ctx) {
                    const count = ref(0);
                    const onClick = () => { count.value += 1; };

                    provide(identifier, count);

                    return { onClick };
                },
                render (state, ctx) {
                    return h('button', { onClick: state.onClick }, [
                        ctx.slot()
                    ]);
                }
            });

            const Consumer = defineComponent({
                setup (props, ctx) {
                    const providedValue = inject(identifier);

                    return { providedValue };
                },
                render (state) {
                    return h('div', {}, [
                        `${state.providedValue?.value}`
                    ]);
                }
            });

            const wrapper = render(h(Provider, {}, [
                h(Consumer, { key: 'consumer' })
            ]) as any);
            await fireEvent.click(wrapper.container.firstChild as Element);
            expect(await wrapper.findByText('1')).toBeTruthy();
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should provide reactive data based on id', async () => {
            const Provider = defineComponent({
                setup (props, ctx) {
                    const text = ref(props.id);
                    const onClick = () => { text.value = 'abc'; };

                    provide(props.id, text);

                    return { onClick };
                },
                render (state, ctx) {
                    return h('button', { onClick: state.onClick }, [
                        ctx.slot()
                    ]);
                }
            });

            const Consumer = defineComponent({
                setup (props, ctx) {
                    const providedValue = inject(props.id);

                    return { providedValue };
                },
                render (state) {
                    return h('div', {}, [
                        `${state.providedValue?.value}`
                    ]);
                }
            });

            const wrapper = render(h('div', {}, [
                h(Provider, { id: 'a', key: 'a' }, [
                    h(Consumer, { id: 'a', key: 'aa' })
                ]),
                h(Provider, { id: 'b', key: 'b' }, [
                    h(Consumer, { id: 'b', key: 'bb' })
                ])
            ]) as any);
            const buttons = wrapper.container.querySelectorAll('button');

            expect(wrapper.container.firstChild).toMatchSnapshot();
            await fireEvent.click(buttons[0] as Element);
            expect(wrapper.container.firstChild).toMatchSnapshot();
            await fireEvent.click(buttons[1] as Element);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });
    });
});
