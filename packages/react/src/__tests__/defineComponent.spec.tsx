import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import {
    defineComponent,
    h,
    Fragment,
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
            const Component = defineComponent<{ initialValue: number; }, { count: Ref<number>; onClick:() => void }>({
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
                    const Component = defineComponent<{}, {}>({
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
    });
});
