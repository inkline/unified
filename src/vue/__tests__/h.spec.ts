import { h } from '@inkline/ucd/vue';

describe('vue', () => {
    describe('h()', () => {
        it('should return a VNode', () => {
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
    });
});
