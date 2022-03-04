import { render, fireEvent } from '@testing-library/vue';
import { defineComponent, h, ref, inject, provide, Events } from '@inkline/paper/vue';
describe('vue', () => {
    describe('defineComponent()', () => {
        it('should render component', () => {
            const componentDefinition = defineComponent({
                render() {
                    return h('div');
                }
            });
            expect(componentDefinition).toEqual(componentDefinition);
        });
        it('should render a vue component with state', () => {
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
            const wrapper = render(Component);
            expect(wrapper.html()).toMatchSnapshot();
        });
        it('should render a component with state and props', () => {
            const Component = defineComponent({
                props: {
                    initialValue: {
                        type: Number,
                        default: 0
                    }
                },
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
            const wrapper = render(Component, {
                props: {
                    initialValue: 1
                }
            });
            expect(wrapper.html()).toMatchSnapshot();
        });
        it('should render a component with state, props, and onClick state function', async () => {
            const Component = defineComponent({
                props: {
                    initialValue: {
                        type: Number,
                        default: 0
                    }
                },
                setup(props) {
                    const count = ref(props.initialValue);
                    const onClick = () => {
                        count.value += 1;
                    };
                    return { count, onClick };
                },
                render(state) {
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
            await fireEvent.click(wrapper.container.firstChild);
            expect(wrapper.html()).toMatchSnapshot();
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
                    const wrapper = render(Component, {
                        slots: {
                            default: '<span>Child</span>'
                        }
                    });
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
                    const wrapper = render(Component, {
                        slots: {
                            default: [
                                '<span>Child 1</span>',
                                '<span>Child 2</span>',
                                '<span>Child 3</span>'
                            ]
                        }
                    });
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
                    const wrapper = render(Component, {
                        slots: {
                            header: ['<span>Header</span>'],
                            default: ['<span>Body</span>'],
                            footer: ['<span>Footer</span>']
                        }
                    });
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });
            });
            describe('emit()', () => {
                it('should emit event by using native emit', async () => {
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
                    const wrapper = render(Component);
                    await fireEvent.click(wrapper.container.firstChild);
                    expect(wrapper.emitted().click).toBeTruthy();
                });
                it('should emit event with arguments', async () => {
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
                    const wrapper = render(Component);
                    await fireEvent.click(wrapper.container.firstChild);
                    expect(wrapper.emitted().click).toBeTruthy();
                    expect(wrapper.emitted().click[0]).toEqual(expect.any(Object));
                });
                it('should render component with modelValue and update:modelValue', async () => {
                    const Component = defineComponent({
                        props: {
                            modelValue: {
                                type: Number,
                                default: 0
                            }
                        },
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
                    const wrapper = render(Component, {
                        props: {
                            modelValue: value,
                            'onUpdate:modelValue': onUpdate
                        }
                    });
                    await fireEvent.click(wrapper.container.firstChild);
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
                    const wrapper = render(Component, {
                        props: {
                            modelValue: value,
                            'onUpdate:modelValue': onUpdate
                        }
                    });
                    await fireEvent.update(wrapper.container.firstChild, 'abc');
                    expect(onUpdate).toHaveBeenCalled();
                    expect(value).toEqual('abc');
                });
            });
            describe('provide/inject()', () => {
                it('should provide data to children', async () => {
                    const identifier = Symbol('provide');
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
                                state.providedValue
                            ]);
                        }
                    });
                    const wrapper = render(Provider, {
                        slots: {
                            default: Consumer
                        }
                    });
                    expect(wrapper.html()).toMatchSnapshot();
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
                                state.providedValue?.value
                            ]);
                        }
                    });
                    const wrapper = render(Provider, {
                        slots: {
                            default: Consumer
                        }
                    });
                    await fireEvent.click(wrapper.container.firstChild);
                    expect(wrapper.findByText('1')).toBeTruthy();
                    expect(wrapper.html()).toMatchSnapshot();
                });
            });
        });
    });
});
//# sourceMappingURL=defineComponent.spec.js.map