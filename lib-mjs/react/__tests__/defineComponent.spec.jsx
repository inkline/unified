import React from 'react';
import { defineComponent, h, ref, Events, inject, provide } from '@inkline/paper/react';
import { fireEvent, render } from '@testing-library/react';
describe('react', () => {
    describe('defineComponent()', () => {
        it('should render component', () => {
            const Component = defineComponent({
                render() {
                    return h('div');
                }
            });
            const wrapper = render(<Component />);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });
        it('should render component with state', () => {
            const Component = defineComponent({
                setup() {
                    const count = ref(0);
                    return { count };
                },
                render(state) {
                    return h('button', {}, [
                        `${state.count.value}`
                    ]);
                }
            });
            const wrapper = render(<Component />);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });
        it('should render component with state and props', () => {
            const Component = defineComponent({
                setup(props) {
                    const count = ref(props.initialValue);
                    return { count };
                },
                render(state) {
                    return h('button', {}, [
                        `${state.count.value}`
                    ]);
                }
            });
            const wrapper = render(<Component initialValue={1}/>);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });
        it('should render component with state, props, and onClick state function', () => {
            const Component = defineComponent({
                setup(props) {
                    const count = ref(props.initialValue);
                    const onClick = () => {
                        count.value += 1;
                    };
                    return { count, onClick };
                },
                render(state) {
                    return h('button', { onClick: state.onClick }, [
                        `${state.count.value}`
                    ]);
                }
            });
            const wrapper = render(<Component initialValue={1}/>);
            fireEvent.click(wrapper.container.firstChild);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });
        describe('context', () => {
            describe('slot()', () => {
                it('should render react component with default slot, one child', () => {
                    const Component = defineComponent({
                        render(state, ctx) {
                            return h('div', {}, [
                                ctx.slot()
                            ]);
                        }
                    });
                    const wrapper = render(<Component>
                        <span>Child</span>
                    </Component>);
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });
                it('should render react component with default slot, multiple children', () => {
                    const Component = defineComponent({
                        render(state, ctx) {
                            return h('div', {}, [
                                ctx.slot()
                            ]);
                        }
                    });
                    const wrapper = render(<Component>
                        <span>Child 1</span>
                        <span>Child 2</span>
                        <span>Child 3</span>
                    </Component>);
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });
                it('should render react component with named default slot', () => {
                    const Component = defineComponent({
                        render(state, ctx) {
                            return h('div', {}, [
                                ctx.slot()
                            ]);
                        }
                    });
                    const wrapper = render(<Component>
                        <Component.Default>
                            <span>Child</span>
                        </Component.Default>
                    </Component>);
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });
                it('should render react component with aggregated default slot and named default slot', () => {
                    const Component = defineComponent({
                        render(state, ctx) {
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
                    </Component>);
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });
                it('should render react component with named slots', () => {
                    const Component = defineComponent({
                        slots: [
                            'header',
                            'footer'
                        ],
                        emits: [
                            'onUpdateModelValue'
                        ],
                        render(state, ctx) {
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
                    </Component>);
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });
            });
            describe('emit()', () => {
                it('should emit event by attaching on[EventName] callback', () => {
                    const Component = defineComponent({
                        emits: [
                            'click'
                        ],
                        setup(props, ctx) {
                            const onClick = () => {
                                ctx.emit('click');
                            };
                            return { onClick };
                        },
                        render(state) {
                            return h('button', { onClick: state.onClick }, ['Button']);
                        }
                    });
                    const onClick = vi.fn();
                    const wrapper = render(<Component onClick={onClick}/>);
                    fireEvent.click(wrapper.container.firstChild);
                    expect(onClick).toHaveBeenCalled();
                });
                it('should emit event with arguments', () => {
                    const Component = defineComponent({
                        emits: [
                            'click'
                        ],
                        setup(props, ctx) {
                            const onClick = (event) => {
                                ctx.emit('click', event);
                            };
                            return { onClick };
                        },
                        render(state) {
                            return h('button', { onClick: state.onClick }, ['Button']);
                        }
                    });
                    const onClick = vi.fn();
                    const wrapper = render(<Component onClick={onClick}/>);
                    fireEvent.click(wrapper.container.firstChild);
                    expect(onClick).toHaveBeenCalled();
                    expect(onClick.mock.calls[0][0]).toEqual(expect.any(Object));
                });
                it('should render component with modelValue and update:modelValue', () => {
                    const Component = defineComponent({
                        emits: [
                            'update:modelValue'
                        ],
                        setup(props, ctx) {
                            const onClick = () => {
                                ctx.emit('update:modelValue', props.modelValue + 1);
                            };
                            return { onClick };
                        },
                        render(state) {
                            return h('button', { onClick: state.onClick }, ['Button']);
                        }
                    });
                    let value = 3;
                    const onUpdate = vi.fn((newValue) => { value = newValue; });
                    const wrapper = render(<Component modelValue={value} onUpdate:modelValue={onUpdate}/>);
                    fireEvent.click(wrapper.container.firstChild);
                    expect(onUpdate).toHaveBeenCalled();
                    expect(value).toEqual(4);
                });
                it('should render component with input field', () => {
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
                        setup(props, ctx) {
                            const onChange = (event) => {
                                ctx.emit('update:modelValue', event.target.value);
                            };
                            return { onChange };
                        },
                        render(state) {
                            return h('input', { value: state.modelValue, [Events.onInputChange]: state.onChange });
                        }
                    });
                    let value = '';
                    const onUpdate = vi.fn((newValue) => { value = newValue; });
                    const wrapper = render(<Component modelValue={value} onUpdate:modelValue={onUpdate}/>);
                    fireEvent.change(wrapper.container.firstChild, { target: { value: 'abc' } });
                    expect(onUpdate).toHaveBeenCalled();
                    expect(value).toEqual('abc');
                });
            });
            describe('provide/inject()', () => {
                it('should provide data to children', async () => {
                    const identifier = Symbol('provide-reactive');
                    const Provider = defineComponent({
                        setup(props, ctx) {
                            provide(identifier, 'value');
                            return {};
                        },
                        render(state, ctx) {
                            return h('div', {}, [
                                ctx.slot()
                            ]);
                        }
                    });
                    const Consumer = defineComponent({
                        setup(props, ctx) {
                            const providedValue = inject(identifier);
                            return { providedValue };
                        },
                        render(state) {
                            return h('div', {}, [
                                `${state.providedValue}`
                            ]);
                        }
                    });
                    const wrapper = render(<Provider>
                        <Consumer />
                    </Provider>);
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });
                it('should provide reactive data to children', async () => {
                    const identifier = Symbol('provide-reactive');
                    const Provider = defineComponent({
                        setup(props, ctx) {
                            const count = ref(0);
                            const onClick = () => { count.value += 1; };
                            provide(identifier, count);
                            return { onClick };
                        },
                        render(state, ctx) {
                            return h('button', { onClick: state.onClick }, [
                                ctx.slot()
                            ]);
                        }
                    });
                    const Consumer = defineComponent({
                        setup(props, ctx) {
                            const providedValue = inject(identifier);
                            return { providedValue };
                        },
                        render(state) {
                            return h('div', {}, [
                                `${state.providedValue?.value}`
                            ]);
                        }
                    });
                    const wrapper = render(<Provider>
                        <Consumer />
                    </Provider>);
                    fireEvent.click(wrapper.container.firstChild);
                    expect(await wrapper.findByText('1')).toBeTruthy();
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });
                it('should provide reactive data based on id', async () => {
                    const Provider = defineComponent({
                        setup(props, ctx) {
                            const text = ref(props.id);
                            const onClick = () => { text.value = 'abc'; };
                            provide(props.id, text);
                            return { onClick };
                        },
                        render(state, ctx) {
                            return h('button', { onClick: state.onClick }, [
                                ctx.slot()
                            ]);
                        }
                    });
                    const Consumer = defineComponent({
                        setup(props, ctx) {
                            const providedValue = inject(props.id);
                            return { providedValue };
                        },
                        render(state) {
                            return h('div', {}, [
                                `${state.providedValue?.value}`
                            ]);
                        }
                    });
                    const wrapper = render(<div>
                        <Provider id="a">
                            <Consumer id="a"/>
                        </Provider>
                        <Provider id="b">
                            <Consumer id="b"/>
                        </Provider>
                    </div>);
                    const buttons = wrapper.container.querySelectorAll('button');
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                    fireEvent.click(buttons[0]);
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                    fireEvent.click(buttons[1]);
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });
            });
        });
    });
});
//# sourceMappingURL=defineComponent.spec.jsx.map