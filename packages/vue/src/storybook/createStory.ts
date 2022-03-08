import { defineComponent, h } from '../index';
import { DefineComponent } from '@vue/runtime-core';

export const createStory = (component: DefineComponent, args: { class?: string; } = {}) => () => defineComponent({
    render: () => h('div', {
        class: `storybook-example ${args.class || ''}`
    }, [
        h(component, args)
    ])
});
