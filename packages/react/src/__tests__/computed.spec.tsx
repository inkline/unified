import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { computed, defineComponent, h, ref } from '../index';

describe('react', () => {
    describe('computed()', () => {
        it('should create a new computed value', () => {
            const Component = defineComponent({
                setup () {
                    const state = computed(() => 'hello');

                    expect(state).toEqual({
                        value: 'hello'
                    });

                    return { state };
                },
                render ({ state }) {
                    return h('div', {}, [state.value]);
                }
            });

            const wrapper = render(h(Component) as any);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should compute value based on other refs', () => {
            const Component = defineComponent({
                setup () {
                    const a = ref(1);
                    const b = ref(2);
                    const state = computed(() => a.value + b.value);

                    expect(state.value).toEqual(3);

                    return { state };
                },
                render ({ state }) {
                    return h('div', {}, [state.value]);
                }
            });

            const wrapper = render(h(Component) as any);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should update value based on other refs', async () => {
            const Component = defineComponent({
                setup () {
                    const a = ref(1);
                    const b = ref(2);
                    const state = computed(() => a.value + b.value);

                    const onClick = () => {
                        a.value = 4;
                        b.value = 6;
                    };

                    return { state, onClick };
                },
                render ({ state, onClick }) {
                    return h('div', { onClick }, [state.value]);
                }
            });

            const wrapper = render(h(Component) as any);
            await fireEvent.click(wrapper.container.firstChild as Element);

            expect(wrapper.container.firstChild).toMatchSnapshot();
        });
    });
});
