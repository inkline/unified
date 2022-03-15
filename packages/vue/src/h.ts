import { h as createElement, VNode } from 'vue';
import { HoistFn } from './types';
import { DefineComponent } from '@vue/runtime-core';

/**
 * Render native element or Vue.js component
 *
 * @example h('p', { class: 'paragraph' }, 'Hello world!')
 * @example h(Component, { color: 'primary' }, { default: () => 'Hello world!' })
 */
export const h: HoistFn<VNode, DefineComponent<any>> = (
    type,
    props?,
    ...children
) => {
    return createElement(type as DefineComponent<any>, props, ...children);
};
