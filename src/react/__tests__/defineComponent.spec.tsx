import React from 'react';
import {
    defineComponent,
    h,
    ref
} from '@inkline/ucd/react';
import { fireEvent, render } from '@testing-library/react';
import { Ref } from '@inkline/ucd/types';

describe('react', () => {
    describe('defineComponent()', () => {
        it('should render react component', () => {
            const Component = defineComponent({
                render () {
                    return h('div');
                }
            });

            const wrapper = render(<Component /> as any);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should render react component with state', () => {
            const Component = defineComponent<{}, { count: Ref<number>; }>({
                setup () {
                    const count = ref(0);

                    return { count };
                },
                render (state) {
                    return h('button', {}, [
                        `${state.count.value}`
                    ]);
                }
            });

            const wrapper = render(<Component /> as any);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should render react component with state and props', () => {
            const Component = defineComponent<{ initialValue: number; }, { count: Ref<number>; }>({
                setup (props) {
                    const count = ref(props.initialValue);

                    return { count };
                },
                render (state) {
                    return h('button', {}, [
                        `${state.count.value}`
                    ]);
                }
            });

            const wrapper = render(<Component initialValue={1} /> as any);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should render react component with state, props, and onClick', () => {
            const Component = defineComponent<{ initialValue: number; }, { count: Ref<number>; onClick:() => void }>({
                setup (props) {
                    const count = ref(props.initialValue);

                    const onClick = () => {
                        count.value += 1;
                    };

                    return { count, onClick };
                },
                render (state) {
                    return h('button', { onClick: state.onClick }, [
                        `${state.count.value}`
                    ]);
                }
            });

            const wrapper = render(<Component initialValue={1} /> as any);
            fireEvent.click(wrapper.container.firstChild as Element);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        describe('slots', () => {
            it('should render react component with default slot, one child', () => {
                const Component = defineComponent<{}, {}>({
                    slots: ['header'],
                    render (state, ctx) {
                        return h('div', {}, [
                            ctx.useSlot()
                        ]);
                    }
                });

                const wrapper = render(<Component>
                    <span>Child</span>
                </Component> as any);
                expect(wrapper.container.firstChild).toMatchSnapshot();
            });

            it('should render react component with default slot, multiple children', () => {
                const Component = defineComponent<{}, {}>({
                    slots: ['header'],
                    render (state, ctx) {
                        return h('div', {}, [
                            ctx.useSlot()
                        ]);
                    }
                });

                const wrapper = render(<Component>
                    <span>Child 1</span>
                    <span>Child 2</span>
                    <span>Child 3</span>
                </Component> as any);
                expect(wrapper.container.firstChild).toMatchSnapshot();
            });

            it('should render react component with named default slot', () => {
                const Component = defineComponent<{}, {}>({
                    render (state, ctx) {
                        return h('div', {}, [
                            ctx.useSlot()
                        ]);
                    }
                });

                const wrapper = render(<Component>
                    <Component.Default>
                        <span>Child</span>
                    </Component.Default>
                </Component> as any);
                expect(wrapper.container.firstChild).toMatchSnapshot();
            });

            it('should render react component with aggregated default slot and named default slot', () => {
                const Component = defineComponent<{}, {}>({
                    render (state, ctx) {
                        return h('div', {}, [
                            ctx.useSlot()
                        ]);
                    }
                });

                const wrapper = render(<Component>
                    <span>Default Slot Child 1</span>
                    <Component.Default>
                        <span>Named Default Slot Child</span>
                    </Component.Default>
                    <span>Default Slot Child 2</span>
                </Component> as any);
                expect(wrapper.container.firstChild).toMatchSnapshot();
            });

            it('should render react component with named slots', () => {
                const Component = defineComponent<{}, {}>({
                    slots: [
                        'header',
                        'footer'
                    ],
                    emits: [
                        'onUpdateModelValue'
                    ],
                    render (state, ctx) {
                        return h('div', {}, [
                            ctx.useSlot('header'),
                            ctx.useSlot(),
                            ctx.useSlot('footer')
                        ]);
                    }
                });

                const wrapper = render(<Component>
                    <Component.Header>
                        <span>Header</span>
                    </Component.Header>
                    <span>Child</span>
                    <Component.Footer>
                        <span>Footer</span>
                    </Component.Footer>
                </Component> as any);
                expect(wrapper.container.firstChild).toMatchSnapshot();
            });
        });
    });
});
