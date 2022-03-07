import { h as nativeH, VNode } from 'vue';
import { HoistFn } from './types';
import { DefineComponent } from '@vue/runtime-core';

export const h: HoistFn<VNode, DefineComponent> = (
    type,
    props?,
    children?
) => nativeH(type, props, children);
