import { describe, it, expect } from 'vitest';
import { h } from '../index';

describe('vue', () => {
    describe('h()', () => {
        it('should return a vNode', () => {
            const type = 'div';
            const props = { id: 'app' };
            const children = [
                h('span')
            ];
            const vNode = h(type, props, children);

            expect(vNode).toHaveProperty('target');
            expect(vNode).toHaveProperty('el');
            expect(vNode.type).toEqual(type);
            expect(vNode.props).toEqual(props);
            expect(vNode.children).toEqual(children);
        });

        it('should return native element', () => {
            const type = 'div';
            const vNode = h(type);

            expect(vNode).toBeDefined();
            expect(vNode.type).toEqual(type);
        });

        it('should return native vNode with props', () => {
            const type = 'div';
            const props = { id: 'app' };
            const vNode = h(type, props);

            expect(vNode).toBeDefined();
            expect(vNode.type).toEqual(type);
            expect(vNode.props).toEqual(props);
        });

        it('should return native vNode with one child', () => {
            const type = 'div';
            const props = { id: 'app' };
            const children = [
                h('span', { key: 0 })
            ];
            const vNode = h(type, props, children);

            expect(vNode).toBeDefined();
            expect(vNode.type).toEqual('div');
            expect(vNode.props).toEqual(props);
            expect(vNode.children).toEqual(children);
        });

        it('should return native vNode with multiple children', () => {
            const type = 'div';
            const props = { id: 'app' };
            const children = [
                h('span', { key: 0 }),
                h('span', { key: 1 }),
                h('span', { key: 2 })
            ];
            const vNode = h(type, props, children);

            expect(vNode).toBeDefined();
            expect(vNode.type).toEqual('div');
            expect(vNode.props).toEqual(props);
            expect(vNode.children).toEqual(children);
        });

        it('should accept multiple children as spread argument', () => {
            const type = 'div';
            const props = { id: 'app' };
            const children = [
                h('span', { key: 0 }),
                h('span', { key: 1 }),
                h('span', { key: 2 })
            ];
            const vNode = h(type, props, ...children);

            expect(vNode).toBeDefined();
            expect(vNode.type).toEqual('div');
            expect(vNode.props).toEqual(props);
            expect(vNode.children).toEqual(children);
        });
    });
});
