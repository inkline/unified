import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { watch, defineComponent, h, ref } from '../index';

describe('react', () => {
    describe('watch()', () => {
        it('should create a new watcher', () => {
            const callback = vi.fn();
            const Component = defineComponent({
                setup () {
                    const state = ref('example');

                    watch(() => state, (newValue) => callback(newValue.value));

                    const onClick = () => {
                        state.value = 'new';
                    };

                    return { state, onClick };
                },
                render ({ state, onClick }) {
                    return h('button', { onClick }, [state.value]);
                }
            });

            const wrapper = render(h(Component) as any);
            fireEvent.click(wrapper.container.firstChild as Element);
            expect(callback).toHaveBeenCalledOnce();
            expect(callback).toHaveBeenCalledWith('new');
        });

        it('should trigger watcher every time the value changes', () => {
            const callback = vi.fn();
            const Component = defineComponent({
                setup () {
                    const state = ref(0);

                    watch(() => state, (newValue) => callback(newValue.value));

                    const onClick = () => {
                        state.value = state.value + 1;
                    };

                    return { state, onClick };
                },
                render ({ state, onClick }) {
                    return h('button', { onClick }, [state.value]);
                }
            });

            const wrapper = render(h(Component) as any);
            fireEvent.click(wrapper.container.firstChild as Element);
            expect(callback).toHaveBeenNthCalledWith(1, 1);
            fireEvent.click(wrapper.container.firstChild as Element);
            expect(callback).toHaveBeenNthCalledWith(2, 2);
            fireEvent.click(wrapper.container.firstChild as Element);
            expect(callback).toHaveBeenNthCalledWith(3, 3);
            expect(callback).toHaveBeenCalledTimes(3);
        });
    });
});
