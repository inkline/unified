import { DefineComponentFn, DefinePluginFn } from './types-common';
import { Component, FunctionComponent } from 'react';

export * from './types-common';

export type VNode = JSX.Element | null;

export type Slots = {
    [key: string]: {
        (): null;
        key?: string;
    }
};

export type DefineReactComponentFn<
    Props = Record<string, any>,
    State = Record<string, any>
> = DefineComponentFn<Props, State, VNode, FunctionComponent<Props> & { [key: string]: any; }>

export type DefineReactPluginFn<Options = any> = DefinePluginFn<typeof Component, Options>;
