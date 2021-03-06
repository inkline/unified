import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/vue';
import { defineComponent, h, ref, Events } from '../index';

describe('vue', () => {
    describe('defineComponent()', () => {
        it('should render component', () => {
            const componentDefinition = defineComponent({
                render () {
                    return <div />;
                }
            });

            expect(componentDefinition).toEqual(componentDefinition);
        });

        it('should render a vue component with state', () => {
            const Component = defineComponent({
                setup () {
                    const count = ref(0);

                    return { count };
                },
                render (state) {
                    return <button>
                        {state.count.value}
                    </button>;
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
                setup (props) {
                    const count = ref(props.initialValue);

                    return { count };
                },
                render (state) {
                    return <button>{state.count.value}</button>;
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
                setup (props) {
                    const count = ref(props.initialValue);

                    const onClick = () => {
                        count.value += 1;
                    };

                    return { count, onClick };
                },
                render (state) {
                    return <button onClick={() => state.onClick() }>{state.count.value}</button>;
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

        describe('context', () => {
            describe('slot()', () => {
                it('should render react component with default slot, one child', () => {
                    const Component = defineComponent({
                        render (state, ctx) {
                            return <div>{ctx.slot()}</div>;
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
                        render (state, ctx) {
                            return <div>
                                {ctx.slot()}
                            </div>;
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
                        render (state, ctx) {
                            return <div>
                                {ctx.slot('header')}
                                {ctx.slot()}
                                {ctx.slot('footer')}
                            </div>;
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
                        setup (props, ctx) {
                            const onClick = () => {
                                ctx.emit('click');
                            };

                            return { onClick };
                        },
                        render (state) {
                            return <button onClick={state.onClick}>Button</button>;
                        }
                    });

                    const wrapper = render(Component);
                    await fireEvent.click(wrapper.container.firstChild as Element);

                    expect(wrapper.emitted().click).toBeTruthy();
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
                            return <button onClick={state.onClick}>Button</button>;
                        }
                    });

                    const wrapper = render(Component);
                    await fireEvent.click(wrapper.container.firstChild as Element);

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
                        setup (props, ctx) {
                            const onClick = () => {
                                ctx.emit('update:modelValue', props.modelValue + 1);
                            };

                            return { onClick };
                        },
                        render (state) {
                            return <button onClick={state.onClick}>Button</button>;
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
                            const events = {
                                [Events.onInputChange]: state.onChange
                            };

                            return <input value={state.modelValue} {...events} />;
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

                    await fireEvent.update(wrapper.container.firstChild as Element, 'abc');

                    expect(onUpdate).toHaveBeenCalled();
                    expect(value).toEqual('abc');
                });
            });

            describe('provide/inject()', () => {
                it('should provide data to children', async () => {
                    const identifier = Symbol('provide');
                    const Provider = defineComponent({
                        setup (props, ctx) {
                            ctx.provide(identifier, 'value');

                            return {};
                        },
                        render (state, ctx) {
                            return <div>{ctx.slot()}</div>;
                        }
                    });

                    const Consumer = defineComponent({
                        setup (props, ctx) {
                            const providedValue = ctx.inject(identifier);

                            return { providedValue };
                        },
                        render (state) {
                            return <div>{state.providedValue}</div>;
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
                        setup (props, ctx) {
                            const count = ref(0);
                            const onClick = () => { count.value += 1; };

                            ctx.provide(identifier, count);

                            return { onClick };
                        },
                        render (state, ctx) {
                            return <button onClick={state.onClick}>{ctx.slot()}</button>;
                        }
                    });

                    const Consumer = defineComponent({
                        setup (props, ctx) {
                            const providedValue = ctx.inject(identifier);

                            return { providedValue };
                        },
                        render (state) {
                            return <div>{state.providedValue?.value}</div>;
                        }
                    });

                    const wrapper = render(Provider, {
                        slots: {
                            default: Consumer
                        }
                    });
                    await fireEvent.click(wrapper.container.firstChild as Element);
                    expect(wrapper.findByText('1')).toBeTruthy();
                    expect(wrapper.html()).toMatchSnapshot();
                });
            });
        });
    });
});
