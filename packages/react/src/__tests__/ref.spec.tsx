import React from 'react';
import { defineComponent, h, ref } from '../index';
import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/react';

describe('react', () => {
    describe('ref()', () => {
        it('should create a reference value', () => {
            const Component = defineComponent({
                setup () {
                    const state = ref('hello');

                    expect(state).toEqual({
                        value: 'hello'
                    });

                    return { state };
                },
                render ({ state }) {
                    return h('div', {}, [state.value]);
                }
            });

            const wrapper = render(<Component /> as any);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        describe('getter', () => {
            it('should return current value', () => {
                const Component = defineComponent({
                    setup () {
                        const state = ref('hello');

                        expect(state.value).toEqual('hello');

                        return { state };
                    },
                    render ({ state }) {
                        return h('div', {}, [state.value]);
                    }
                });

                const wrapper = render(<Component /> as any);
                expect(wrapper.container.firstChild).toMatchSnapshot();
            });
        });

        describe('setter', () => {
            it('should set a new string value', async () => {
                const Component = defineComponent({
                    setup () {
                        const state = ref('hello');

                        const onClick = () => {
                            state.value = 'world';
                        };

                        return { state, onClick };
                    },
                    render ({ state, onClick }) {
                        return h('button', { onClick }, [state.value]);
                    }
                });

                const wrapper = render(<Component /> as any);
                await fireEvent.click(wrapper.container.firstChild as HTMLElement);

                expect(wrapper.container.firstChild).toMatchSnapshot();
                expect(wrapper.getByText('world')).toBeTruthy();
            });

            it('should set a new object value', async () => {
                const Component = defineComponent({
                    setup () {
                        const state = ref({ field: 'hello' });

                        const onClick = () => {
                            state.value = { field: 'world' };
                        };

                        return { state, onClick };
                    },
                    render ({ state, onClick }) {
                        return h('button', { onClick }, [state.value.field]);
                    }
                });

                const wrapper = render(<Component /> as any);
                await fireEvent.click(wrapper.container.firstChild as HTMLElement);

                expect(wrapper.container.firstChild).toMatchSnapshot();
                expect(wrapper.getByText('world')).toBeTruthy();
            });

            it('should set a new array value', async () => {
                const Component = defineComponent({
                    setup () {
                        const state = ref(['a']);

                        const onClick = () => {
                            state.value = state.value.concat(['b']);
                        };

                        return { state, onClick };
                    },
                    render ({ state, onClick }) {
                        return h('button', { onClick }, [state.value.join(', ')]);
                    }
                });

                const wrapper = render(<Component /> as any);
                await fireEvent.click(wrapper.container.firstChild as HTMLElement);

                expect(wrapper.container.firstChild).toMatchSnapshot();
                expect(wrapper.getByText('a, b')).toBeTruthy();
            });
        });
    });
});
