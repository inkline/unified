import { describe, it, expect } from 'vitest';
import { h } from '../index';

describe('react', () => {
    describe('h()', () => {
        it('should return native element', () => {
            const type = 'div';
            const element = h(type);

            expect(element).toBeDefined();
            expect(element!.type).toEqual(type);
        });

        it('should return native element with props', () => {
            const type = 'div';
            const props = { id: 'app' };
            const element = h(type, props);

            expect(element).toBeDefined();
            expect(element!.type).toEqual(type);
            expect(element!.props).toEqual(props);
        });

        it('should return native element with children', () => {
            const type = 'div';
            const props = { id: 'app' };
            const children = [
                h('span', { key: 0 })
            ];
            const element = h(type, props, children);

            expect(element).toBeDefined();
            expect(element!.type).toEqual('div');
            expect(element!.props).toEqual({ ...props, children });
        });

        it('should replace class prop with className', () => {
            const type = 'div';
            const props = { class: 'example' };
            const element = h(type, props);

            expect(element).toBeDefined();
            expect(element!.props).toEqual({ className: props.class, children: undefined });
        });
    });
});
