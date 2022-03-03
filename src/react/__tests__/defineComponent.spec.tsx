import React from 'react';
import {
    defineComponent,
    h,
    ref,
    Events
} from '@inkline/ucd/react';
import { fireEvent, render } from '@testing-library/react';
import { Ref } from '@inkline/ucd/types';

describe('react', () => {
    describe('defineComponent()', () => {
        it('should render component', () => {
            const Component = defineComponent({
                render () {
                    return h('div');
                }
            });

            const wrapper = render(<Component /> as any);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should render component with state', () => {
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

            const wrapper = render(<Component initialValue={1} /> as any);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should render component with state, props, and onClick state function', () => {
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

                    const wrapper = render(<Component>
                        <span>Child</span>
                    </Component> as any);
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
                                ctx.slot()
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
                                ctx.slot()
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
                                ctx.slot('header'),
                                ctx.slot(),
                                ctx.slot('footer')
                            ]);
                        }
                    });

                    const wrapper = render(<Component>
                        <Component.Header>
                            <span>Header</span>
                        </Component.Header>
                        <span>Body</span>
                        <Component.Footer>
                            <span>Footer</span>
                        </Component.Footer>
                    </Component> as any);
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });
            });

            describe('emit()', () => {
                it('should emit event by attaching on[EventName] callback', () => {
                    const Component = defineComponent<{ [key: string]: any; }, { onClick(): void }>({
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
                    const wrapper = render(<Component onClick={onClick} /> as any);
                    fireEvent.click(wrapper.container.firstChild as Element);
                    expect(onClick).toHaveBeenCalled();
                });

                it('should emit event with arguments', () => {
                    const Component = defineComponent<{ [key: string]: any; }, { onClick(event: Event): void }>({
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
                    const wrapper = render(<Component onClick={onClick} /> as any);
                    fireEvent.click(wrapper.container.firstChild as Element);
                    expect(onClick).toHaveBeenCalled();
                    expect(onClick.mock.calls[0][0]).toEqual(expect.any(Object));
                });

                it('should render component with modelValue and update:modelValue', () => {
                    const Component = defineComponent<{ modelValue: number; [key: string]: any; }, { onClick(): void }>({
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
                    const wrapper = render(<Component modelValue={value} onUpdate:modelValue={onUpdate} /> as any);

                    fireEvent.click(wrapper.container.firstChild as Element);

                    expect(onUpdate).toHaveBeenCalled();
                    expect(value).toEqual(4);
                });

                it('should render component with input field', () => {
                    const Component = defineComponent<{ modelValue: string; [key: string]: any; }, { onChange(event: Event): void }>({
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
                    const wrapper = render(<Component modelValue={value} onUpdate:modelValue={onUpdate} /> as any);

                    fireEvent.change(wrapper.container.firstChild as Element, { target: { value: 'abc' } });

                    expect(onUpdate).toHaveBeenCalled();
                    expect(value).toEqual('abc');
                });
            });

            describe('provide/inject()', () => {
                it('should provide data to children', async () => {
                    const identifier = Symbol('provide-reactive');
                    const Provider = defineComponent<{}, {}>({
                        setup (props, ctx) {
                            ctx.provide(identifier, 'value');

                            return {};
                        },
                        render (state, ctx) {
                            return h('div', {}, [
                                ctx.slot()
                            ]);
                        }
                    });

                    const Consumer = defineComponent<{}, { providedValue: string; }>({
                        setup (props, ctx) {
                            const providedValue = ctx.inject<string>(identifier);

                            return { providedValue };
                        },
                        render (state) {
                            return h('div', {}, [
                                state.providedValue
                            ]);
                        }
                    });

                    const wrapper = render(<Provider>
                        <Consumer />
                    </Provider> as any);
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });

                it.only('should provide reactive data to children', async () => {
                    const identifier = Symbol('provide-reactive');
                    const Provider = defineComponent<{}, { onClick(): void }>({
                        setup (props, ctx) {
                            const count = ref(0);
                            const onClick = () => { count.value += 1; };

                            ctx.provide(identifier, count);

                            return { onClick };
                        },
                        render (state, ctx) {
                            return h('button', { onClick: state.onClick }, [
                                ctx.slot()
                            ]);
                        }
                    });

                    const Consumer = defineComponent<{}, { providedValue: Ref<number>; }>({
                        setup (props, ctx) {
                            const providedValue = ctx.inject<Ref<number>>(identifier);

                            return { providedValue };
                        },
                        render (state) {
                            return h('div', {}, [
                                state.providedValue?.value
                            ]);
                        }
                    });

                    const wrapper = render(<Provider>
                        <Consumer />
                    </Provider> as any);
                    fireEvent.click(wrapper.container.firstChild as Element);
                    expect(await wrapper.findByText('1')).toBeTruthy();
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });

                it('should provide reactive data to children 2', async () => {
                    const identifier = Symbol('provide-reactive');

                    const Provider1 = defineComponent<{}, { onClick(): void }>({
                        setup (props, ctx) {
                            const count = ref(0);
                            const onClick = () => { count.value += 1; };

                            ctx.provide(identifier, count);

                            return { onClick };
                        },
                        render (state, ctx) {
                            return h('button', { onClick: state.onClick }, [
                                ctx.slot()
                            ]);
                        }
                    });

                    const Provider2 = defineComponent<{}, { onClick(): void }>({
                        setup (props, ctx) {
                            const count = ref(0);
                            const onClick = () => { count.value += 1; };

                            ctx.provide(identifier, count);

                            return { onClick };
                        },
                        render (state, ctx) {
                            return h('button', { onClick: state.onClick }, [
                                ctx.slot()
                            ]);
                        }
                    });

                    const Consumer = defineComponent<{}, { providedValue: Ref<number>; }>({
                        setup (props, ctx) {
                            const providedValue = ctx.inject<Ref<number>>(identifier);

                            return { providedValue };
                        },
                        render (state) {
                            return h('div', {}, [
                                state.providedValue?.value
                            ]);
                        }
                    });

                    const wrapper = render(<Provider1>
                        <Consumer />
                    </Provider1> as any);
                    fireEvent.click(wrapper.container.firstChild as Element);
                    expect(wrapper.findByText('1')).toBeTruthy();

                    const wrapper2 = render(<Provider2>
                        <Consumer />
                    </Provider2> as any);
                    expect(await wrapper2.findByText('1')).not.toBeTruthy();
                });
            });
        });
    });
});
