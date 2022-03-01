import { render, fireEvent } from '@testing-library/vue';
import { defineComponent, h, ref } from '@inkline/ucd/vue';
import { Ref } from '@inkline/ucd/types';

describe('vue', () => {
    describe('defineComponent()', () => {
        it('should return the component definition itself', () => {
            const componentDefinition = defineComponent({
                render () {
                    return h('div');
                }
            });

            expect(componentDefinition).toEqual(componentDefinition);
        });

        it('should render a vue component with state', () => {
            const Component = defineComponent<{}, { count: Ref<number>; }>({
                setup () {
                    const count = ref(0);

                    return { count };
                },
                render (state) {
                    return h('div', {}, [
                        `${state.count.value}`
                    ]);
                }
            });

            const wrapper = render(Component);
            expect(wrapper.html()).toMatchSnapshot();
        });

        it('should render a vue component with state and props', () => {
            const Component = defineComponent<{ initialValue: number; }, { count: Ref<number>; }>({
                props: {
                    initialValue: {
                        type: Number,
                        default: 0
                    }
                },
                setup (props) {
                    const count = ref(props.initialValue);

                    return { count };
                },
                render (state) {
                    return h('div', {}, [
                        `${state.count.value}`
                    ]);
                }
            });

            const wrapper = render(Component, {
                props: {
                    initialValue: 1
                }
            });
            expect(wrapper.html()).toMatchSnapshot();
        });

        it('should render a vue component with state, props, and onClick', async () => {
            const Component = defineComponent<{ initialValue: number; }, { count: Ref<number>; onClick(): void }>({
                props: {
                    initialValue: {
                        type: Number,
                        default: 0
                    }
                },
                setup (props) {
                    const count = ref(props.initialValue);

                    const onClick = () => {
                        count.value += 1;
                    };

                    return { count, onClick };
                },
                render (state) {
                    return h('button', { onClick: () => state.onClick() }, [
                        `${state.count.value}`
                    ]);
                }
            });

            const wrapper = render(Component, {
                props: {
                    initialValue: 1
                }
            });
            await fireEvent.click(wrapper.container.firstChild as Element);
            expect(wrapper.html()).toMatchSnapshot();
        });
    });
});
