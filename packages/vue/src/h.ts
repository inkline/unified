import { h as createElement, VNode } from 'vue';
import { HoistFn } from './types';
import { DefineComponent } from '@vue/runtime-core';

/**
 * Render native element or Vue.js component
 *
 * @example h('p', { class: 'paragraph' }, 'Hello world')
 */
export const h: HoistFn<VNode, DefineComponent> = (
    type,
    props?,
    children?
) => {
    /**
     * When rendering components, Vue 3 prefers having children returned as a function
     *
     * @example h(Component, {}, children) => h(Component, {}, { default: () => children })
     */
    if (typeof type === 'object' && typeof children !== 'object') {
        children = {
            default: () => children
        } as any;
    }

    return createElement(type, props, children);
};
