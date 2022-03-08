import { h as createElement, VNode } from 'vue';
import { HoistFn } from './types';
import { DefineComponent } from '@vue/runtime-core';

export const h: HoistFn<VNode, DefineComponent> = (
    type,
    props?,
    children?
) => {
    return createElement(type, props, children);
};
