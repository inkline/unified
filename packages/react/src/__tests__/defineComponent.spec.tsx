import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import {
    defineComponent,
    h,
    ref,
    Events,
    Ref
} from '../index';
import { fireEvent, render } from '@testing-library/react';

describe('react', () => {
    describe('defineComponent()', () => {
        it('should render component', () => {
            const Component = defineComponent({
                render () {
                    return h('div');
                }
            });

            const wrapper = render(h(Component) as any);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should render component with state', () => {
            const Component = defineComponent({
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

            const wrapper = render(h(Component) as any);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should render component with state and props', () => {
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

            const wrapper = render(h(Component, { initialValue: 1 }) as any);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should render component with state, props, and onClick state function', async () => {
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

            const wrapper = render(h(Component, { initialValue: 1 }) as any);
            await fireEvent.click(wrapper.container.firstChild as Element);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        describe('context', () => {
            describe('slot()', () => {
                it('should render react component with default slot, one child', () => {
                    const Component = defineComponent<{}, {}>({
                        render (state, ctx) {
                            return h('div', {}, [
                                ctx.slot()
                            ]);
                        }
                    });

                    const wrapper = render(h(Component, {}, h('span', {}, 'Child')) as any);
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });

                it('should render react component with default slot, multiple children', () => {
                    const Component = defineComponent<{}, {}>({
                        render (state, ctx) {
                            return h('div', {}, [
                                ctx.slot()
                            ]);
                        }
                    });

                    const wrapper = render(h(Component, {}, [
                        h('span', { key: 1 }, 'Child 1'),
                        h('span', { key: 2 }, 'Child 2'),
                        h('span', { key: 3 }, 'Child 3')
                    ]) as any);
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });

                it('should render react component with named default slot', () => {
                    const Component = defineComponent<{}, {}>({
                        render (state, ctx) {
                            return h('div', {}, [
                                ctx.slot()
                            ]);
                        }
                    });

                    const wrapper = render(h(Component, {}, {
                        default: () => h('span', {}, 'Child')
                    }) as any);
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });

                it('should render react component with named slots', () => {
                    const Component = defineComponent<{}, {}>({
                        slots: [
                            'header',
                            'footer'
                        ],
                        render (state, ctx) {
                            return h('div', {}, [
                                ctx.slot('header'),
                                ctx.slot(),
                                ctx.slot('footer')
                            ]);
                        }
                    });

                    const wrapper = render(h(Component, {}, {
                        header: () => h('span', {}, 'Header'),
                        default: () => h('span', {}, 'Body'),
                        footer: () => h('span', {}, 'Footer')
                    }) as any);
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });
            });

            describe('emit()', () => {
                it('should emit event by attaching on[EventName] callback', async () => {
                    const Component = defineComponent({
                        emits: [
                            'click'
                        ],
                        setup (props, ctx) {
                            const onClick = () => {
                                ctx.emit('click');
                            };

                            return { onClick };
                        },
                        render (state) {
                            return h('button', { onClick: state.onClick }, ['Button']);
                        }
                    });

                    const onClick = vi.fn();
                    const wrapper = render(h(Component, { onClick }) as any);
                    await fireEvent.click(wrapper.container.firstChild as Element);
                    expect(onClick).toHaveBeenCalled();
                });

                it('should emit event with arguments', async () => {
                    const Component = defineComponent({
                        emits: [
                            'click'
                        ],
                        setup (props, ctx) {
                            const onClick = (event: Event) => {
                                ctx.emit('click', event);
                            };

                            return { onClick };
                        },
                        render (state) {
                            return h('button', { onClick: state.onClick }, ['Button']);
                        }
                    });

                    const onClick = vi.fn();
                    const wrapper = render(h(Component, { onClick }) as any);
                    await fireEvent.click(wrapper.container.firstChild as Element);
                    expect(onClick).toHaveBeenCalled();
                    expect(onClick.mock.calls[0][0]).toEqual(expect.any(Object));
                });

                it('should render component with modelValue and update:modelValue', async () => {
                    const Component = defineComponent({
                        emits: [
                            'update:modelValue'
                        ],
                        setup (props, ctx) {
                            const onClick = () => {
                                ctx.emit('update:modelValue', props.modelValue + 1);
                            };

                            return { onClick };
                        },
                        render (state) {
                            return h('button', { onClick: state.onClick }, ['Button']);
                        }
                    });

                    let value = 3;
                    const onUpdate = vi.fn((newValue) => { value = newValue; });
                    const wrapper = render(h(Component, { modelValue: value, onUpdateModelValue: onUpdate }) as any);

                    await fireEvent.click(wrapper.container.firstChild as Element);

                    expect(onUpdate).toHaveBeenCalled();
                    expect(value).toEqual(4);
                });

                it('should render component with input field', async () => {
                    const Component = defineComponent({
                        props: {
                            modelValue: {
                                type: String,
                                default: ''
                            }
                        },
                        emits: [
                            'update:modelValue'
                        ],
                        setup (props, ctx) {
                            const onChange = (event: Event) => {
                                ctx.emit('update:modelValue', (event.target as HTMLInputElement).value);
                            };

                            return { onChange };
                        },
                        render (state) {
                            return h('input', { value: state.modelValue, [Events.onInputChange]: state.onChange });
                        }
                    });

                    let value = '';
                    const onUpdate = vi.fn((newValue) => { value = newValue; });
                    const wrapper = render(h(Component, { modelValue: value, onUpdateModelValue: onUpdate }) as any);

                    await fireEvent.change(wrapper.container.firstChild as Element, { target: { value: 'abc' } });

                    expect(onUpdate).toHaveBeenCalled();
                    expect(value).toEqual('abc');
                });
            });
        });
    });
});
