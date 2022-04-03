import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import {
    defineComponent,
    h,
    Fragment,
    ref,
    Events
} from '../index';
import { fireEvent, render } from '@testing-library/react';

describe('react', () => {
    describe('defineComponent()', () => {
        it('should render component', () => {
            const Component = defineComponent({
                render () {
                    return <div />;
                }
            });

            const wrapper = render(<Component />);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should render component with state', () => {
            const Component = defineComponent({
                setup () {
                    const count = ref(0);

                    return { count };
                },
                render (state) {
                    return <button>{state.count.value}</button>;
                }
            });

            const wrapper = render(<Component />);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should render component with state and props', () => {
            const Component = defineComponent({
                setup (props) {
                    const count = ref(props.initialValue);

                    return { count };
                },
                render (state) {
                    return <button>{state.count.value}</button>;
                }
            });

            const wrapper = render(<Component initialValue={1} />);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        it('should render component with state, props, and onClick state function', async () => {
            const Component = defineComponent({
                setup (props) {
                    const count = ref(props.initialValue);

                    const onClick = () => {
                        count.value += 1;
                    };

                    return { count, onClick };
                },
                render (state) {
                    return <button onClick={state.onClick}>{state.count.value}</button>;
                }
            });

            const wrapper = render(<Component initialValue={1} />);
            await fireEvent.click(wrapper.container.firstChild as Element);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });

        describe('context', () => {
            describe('slot()', () => {
                it('should render react component with default slot, one child', () => {
                    const Component = defineComponent({
                        render (state, ctx) {
                            return <div>
                                {ctx.slot()}
                            </div>;
                        }
                    });

                    const wrapper = render(<Component>
                        <span>Child</span>
                    </Component>);
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

                    const wrapper = render(<Component>
                        <span>Child 1</span>
                        <span>Child 2</span>
                        <span>Child 3</span>
                    </Component>);
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });

                it('should render react component with named default slot', () => {
                    const Component = defineComponent({
                        render (state, ctx) {
                            return <div>
                                {ctx.slot()}
                            </div>;
                        }
                    });

                    const wrapper = render(<Component>{{
                        default: () => <span>Child</span>
                    }}</Component>);
                    expect(wrapper.container.firstChild).toMatchSnapshot();
                });

                it('should render react component with named slots', () => {
                    const Component = defineComponent({
                        slots: [
                            'header',
                            'footer'
                        ],
                        render (state, ctx) {
                            return <div>
                                {ctx.slot('header')}
                                {ctx.slot()}
                                {ctx.slot('footer')}
                            </div>;
                        }
                    });

                    const wrapper = render(<Component>{{
                        header: () => <span>Header</span>,
                        default: () => <span>Body</span>,
                        footer: () => <span>Footer</span>
                    }}</Component>);
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
                            return <button onClick={state.onClick}>Button</button>;
                        }
                    });

                    const onClick = vi.fn();
                    const wrapper = render(<Component onClick={onClick} />);
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
                            return <button onClick={state.onClick}>Button</button>;
                        }
                    });

                    const onClick = vi.fn();
                    const wrapper = render(<Component onClick={onClick} />);
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
                            return <button onClick={state.onClick}>Button</button>;
                        }
                    });

                    let value = 3;
                    const onUpdate = vi.fn((newValue) => { value = newValue; });
                    const wrapper = render(<Component modelValue={value} onUpdateModelValue={onUpdate} />);

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
                    const wrapper = render(<Component modelValue={value} onUpdateModelValue={onUpdate} />);

                    await fireEvent.change(wrapper.container.firstChild as Element, { target: { value: 'abc' } });

                    expect(onUpdate).toHaveBeenCalled();
                    expect(value).toEqual('abc');
                });
            });
        });

        describe('provide/inject()', () => {
            it('should provide data to children', async () => {
                const identifier = Symbol('provide-reactive');
                const Provider = defineComponent({
                    setup (props, ctx) {
                        ctx.provide(identifier, 'value', []);

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

                const wrapper = render(<Provider>
                    <Consumer key={'consumer'} />
                </Provider>);
                expect(wrapper.container.firstChild).toMatchSnapshot();
            });

            it('should provide reactive data to children', async () => {
                const identifier = Symbol('provide-reactive');
                const Provider = defineComponent({
                    setup (props, ctx) {
                        const count = ref(0);
                        const onClick = () => { count.value += 1; };

                        ctx.provide(identifier, count, [count.value]);

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

                const wrapper = render(<Provider>
                    <Consumer key={'consumer'} />
                </Provider>);
                await fireEvent.click(wrapper.container.firstChild as Element);
                expect(await wrapper.findByText('1')).toBeTruthy();
                expect(wrapper.container.firstChild).toMatchSnapshot();
            });

            it('should overwrite reactive data for deeply nested children', async () => {
                const identifier = Symbol('provide-reactive');
                const ProviderA = defineComponent({
                    setup (props, ctx) {
                        const count = ref(0);

                        ctx.provide(identifier, count, [count.value]);

                        return {};
                    },
                    render (state, ctx) {
                        return <div>{ctx.slot()}</div>;
                    }
                });

                const ProviderB = defineComponent({
                    setup (props, ctx) {
                        const count = ref(1);
                        const onClick = () => { count.value += 1; };

                        ctx.provide(identifier, count, [count.value]);

                        return { onClick };
                    },
                    render (state, ctx) {
                        return <button onClick={state.onClick}>
                            {ctx.slot()}
                        </button>;
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

                const wrapper = render(<ProviderA>
                    <ProviderB>
                        <Consumer key={'consumer'} />
                    </ProviderB>
                </ProviderA>);
                await fireEvent.click(wrapper.container.querySelector('button') as Element);
                expect(await wrapper.findByText('2')).toBeTruthy();
                expect(wrapper.container.firstChild).toMatchSnapshot();
            });

            it('should provide reactive data based on id', async () => {
                const Provider = defineComponent({
                    setup (props, ctx) {
                        const text = ref(props.id);
                        const onClick = () => { text.value = 'abc'; };

                        ctx.provide(props.id, text, [text.value]);

                        return { onClick };
                    },
                    render (state, ctx) {
                        return <button onClick={state.onClick}>{ctx.slot()}</button>;
                    }
                });

                const Consumer = defineComponent({
                    setup (props, ctx) {
                        const providedValue = ctx.inject(props.id);

                        return { providedValue };
                    },
                    render (state) {
                        return <div>{state.providedValue?.value}</div>;
                    }
                });

                const wrapper = render(<div>
                    <Provider id={'a'}>
                        <Consumer id={'a'} />
                    </Provider>
                    <Provider id={'b'}>
                        <Consumer id={'b'}/>
                    </Provider>
                </div>);

                const buttons = wrapper.container.querySelectorAll('button');
                expect(wrapper.container.firstChild).toMatchSnapshot();
                await fireEvent.click(buttons[0] as Element);
                expect(wrapper.container.firstChild).toMatchSnapshot();
                await fireEvent.click(buttons[1] as Element);
                expect(wrapper.container.firstChild).toMatchSnapshot();
            });
        });
    });
});
