import { DefinePluginFn } from './types';

export type DefineGenericPluginFn<Options = any> = DefinePluginFn<any, Options>;

export const definePlugin: DefineGenericPluginFn = () => ({});
