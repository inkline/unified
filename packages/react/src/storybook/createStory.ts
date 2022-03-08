import { defineComponent, h, ReactFC } from '../index';

export const createStory = (Component: ReactFC<any>, args: { class?: string; } = {}) => defineComponent({
    render: () => h('div', {
        class: `storybook-example ${args.class || ''}`
    }, [
        h(Component, args)
    ])
});
