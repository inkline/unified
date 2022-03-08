import { defineComponent, h } from '../index';

export const createStory = (Component: any, args: { class?: string; } = {}) => defineComponent({
    render: () => h('div', {
        class: `storybook-example ${args.class || ''}`
    }, [
        h(Component, args)
    ])
});
