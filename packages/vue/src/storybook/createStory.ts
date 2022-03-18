import { CreateStoryFn, defineComponent, h } from '../index';
import { Component } from '@vue/runtime-core';

export const createStory: CreateStoryFn<Component> = (component, storyArgs = {}) => (args: Record<string, any>) => defineComponent({
    render: () => h('div', {
        class: `storybook-example ${storyArgs.class || ''}`
    }, h(component, args))
});
