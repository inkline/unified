import { DefineComponentFn } from './types-common';
import { VNode } from 'vue';
import { Component } from '@vue/runtime-core';

export * from './types-common';

export { VNode } from 'vue';

export type DefineVueComponentFn<
    State = Record<string, any>,
    Props = Record<string, any>
> = DefineComponentFn<State, Props, VNode, Component>
