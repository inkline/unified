import { CreateStoryFn, defineComponent, h } from '../index';
import { DefineComponent } from '@vue/runtime-core';

export const createStory: CreateStoryFn<DefineComponent<any>> = (component, storyArgs = {}) => (args: Record<string, any>) => defineComponent({
    render: () => h('div', {
        class: `storybook-example ${storyArgs.class || ''}`
    }, h(component, args))
});
