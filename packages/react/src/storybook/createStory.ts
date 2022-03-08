import { CreateStoryFn, h, ReactFC } from '../index';

export const createStory: CreateStoryFn<ReactFC<any>> = (Component, storyArgs = {}) =>
    (args: Record<string, any>) => h('div', {
        class: `storybook-example ${storyArgs.class || ''}`
    }, [
        h(Component, args)
    ]);
