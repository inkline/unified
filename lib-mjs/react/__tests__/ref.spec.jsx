import React from 'react';
import { ref } from '@inkline/paper/react';
import { fireEvent, render } from '@testing-library/react';
describe('react', () => {
    describe('ref()', () => {
        it('should create a reference value', () => {
            const Component = () => {
                const state = ref('hello');
                expect(state).toEqual({
                    value: 'hello'
                });
                return <div>{state.value}</div>;
            };
            const wrapper = render(<Component />);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });
        describe('getter', () => {
            it('should return current value', () => {
                const Component = () => {
                    const state = ref('hello');
                    expect(state.value).toEqual('hello');
                    return <div>{state.value}</div>;
                };
                const wrapper = render(<Component />);
                expect(wrapper.container.firstChild).toMatchSnapshot();
            });
        });
        describe('setter', () => {
            it('should set a new string value', async () => {
                const Component = () => {
                    const state = ref('hello');
                    const onClick = () => {
                        state.value = 'world';
                    };
                    return <button onClick={onClick}>{state.value}</button>;
                };
                const wrapper = render(<Component />);
                fireEvent.click(wrapper.container.firstChild);
                expect(wrapper.container.firstChild).toMatchSnapshot();
                expect(wrapper.getByText('world')).toBeTruthy();
            });
            it('should set a new object value', async () => {
                const Component = () => {
                    const state = ref({ field: 'hello' });
                    const onClick = () => {
                        state.value = { field: 'world' };
                    };
                    return <button onClick={onClick}>{state.value.field}</button>;
                };
                const wrapper = render(<Component />);
                fireEvent.click(wrapper.container.firstChild);
                expect(wrapper.container.firstChild).toMatchSnapshot();
                expect(wrapper.getByText('world')).toBeTruthy();
            });
            it('should set a new array value', async () => {
                const Component = () => {
                    const state = ref(['a']);
                    const onClick = () => {
                        state.value = state.value.concat(['b']);
                    };
                    return <button onClick={onClick}>{state.value.join(', ')}</button>;
                };
                const wrapper = render(<Component />);
                fireEvent.click(wrapper.container.firstChild);
                expect(wrapper.container.firstChild).toMatchSnapshot();
                expect(wrapper.getByText('a, b')).toBeTruthy();
            });
        });
    });
});
//# sourceMappingURL=ref.spec.jsx.map