import { defineComponent, h, CreateStoryFn } from '../index';

export const createStory: CreateStoryFn<any> = (Component, args = {}) => defineComponent({
    render: () => h('div', {
        class: `storybook-example ${args.class || ''}`
    }, [
        h(Component, args)
    ])
});
