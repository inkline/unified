import { DefineComponentFn, DefinePluginFn } from './types-common';
import { Plugin, VNode } from 'vue';
import { Component } from '@vue/runtime-core';

export * from './types-common';

export { VNode } from 'vue';

export type DefineVueComponentFn<
    State = Record<string, any>,
    Props = Record<string, any>
> = DefineComponentFn<State, Props, VNode, Component>

export type DefineVuePluginFn<Options = any> = DefinePluginFn<Plugin, Options & { components?: Record<string, any> }>;
