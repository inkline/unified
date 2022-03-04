import React from 'react';
import { computed, ref } from '@inkline/paper/react';
import { fireEvent, render } from '@testing-library/react';
describe('react', () => {
    describe('computed()', () => {
        it('should create a new computed value', () => {
            const Component = () => {
                const state = computed(() => 'hello');
                expect(state).toEqual({
                    value: 'hello'
                });
                return <div>{state.value}</div>;
            };
            const wrapper = render(<Component />);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });
        it('should compute value based on other refs', () => {
            const Component = () => {
                const a = ref(1);
                const b = ref(2);
                const state = computed(() => a.value + b.value);
                expect(state.value).toEqual(3);
                return <div>{state.value}</div>;
            };
            const wrapper = render(<Component />);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });
        it('should update value based on other refs', () => {
            const Component = () => {
                const a = ref(1);
                const b = ref(2);
                const state = computed(() => a.value + b.value);
                const onClick = () => {
                    a.value = 4;
                    b.value = 6;
                };
                return <div onClick={onClick}>{state.value}</div>;
            };
            const wrapper = render(<Component />);
            fireEvent.click(wrapper.container.firstChild);
            expect(wrapper.container.firstChild).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=computed.spec.jsx.map