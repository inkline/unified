export type Ref<T> = { value: T };

export type UnwrapState<State> = {
    [key in keyof State]: (State[key] & Ref<State[key]>)['value']
};

/**
 * Component definition
 */

export type ConstructorType =
    | NumberConstructor
    | StringConstructor
    | BooleanConstructor
    | ObjectConstructor
    | ArrayConstructor;

export type ComponentProps<Props> = {
    [key in keyof Props]: ConstructorType | {
        type?: ConstructorType;
        default?: Props[key] | (() => Props[key]);
    };
}

export interface EmitFn {
    (eventName: string, ...args: any[]): void;
}

export interface SlotFn<T = any> {
    (name?: string): T;
}

export interface HasSlotFn {
    (name?: string): boolean;
}

export interface ProvideFn<T = any> {
    (identifier: string | symbol, value: T, dependencies?: any[]): void;
}

export interface InjectFn<T = any> {
    (identifier: string | symbol, defaultValue?: T | (() => T)): T | undefined
}

export interface SetupContext {
    emit: EmitFn;
    hasSlot: HasSlotFn;
    provide: ProvideFn;
    inject: InjectFn;
}

export interface RenderContext {
    slot: SlotFn;
    hasSlot: HasSlotFn;
}

export interface ComponentDefinition<
    Props extends Record<string, any> = {},
    State extends Record<string, any> = {},
    VNode = any
> {
    name?: string;
    slots?: string[];
    emits?: string[];
    props?: ComponentProps<Props>;
    setup?(props: Props, context: SetupContext): State;
    render(state: Props & State, context: RenderContext): VNode;
}

/**
 * Providers
 */

export interface Providers {
    [key: string | symbol]: {
        state: any;
        listeners: any[];
        setState(newValue: any): void;
        notify(newValue: any): void;
    };
}

export interface RegisterProviderFn<T = any> {
    (identifier: string | symbol, value: T): void;
}

export interface UpdateProviderFn<T = any> {
    (identifier: string | symbol, value: T): void;
}

/**
 * Function types
 */

export interface DefineComponentFn<Props, State, VNode = any, ComponentType = any> {
    (definition: ComponentDefinition<Props, State, VNode>): ComponentType;
}

export interface RefFn<T = any> {
    (initialValue: T): Ref<T>;
}

export interface ComputedFn<T = any> {
    (computeFn: () => T, dependencies?: any[]): Ref<T>;
}

export interface WatchFn<T = any> {
    (dependency: () => T, callback: (newValue: T) => void): void;
}

export interface HoistFn<T = any, D = any, C = (string | number | boolean | T)> {
    (type: string | D, props?: Record<string, any>, ...children: (C | C[] | Record<string, () => (C | C[])>)[]): T
}

export interface FragmentFn<C> {
    (props: { children?: C | C[] }): C | C[] | undefined;
}

/**
 * Plugin types
 */

export interface DefinePluginContext {
    provide: ProvideFn;
}

export interface DefinePluginFn<Plugin, Options = any> {
    (setup: (options: Options, context: DefinePluginContext) => void): Plugin;
}

/**
 * Storybook types
 */

export interface CreateStoryFn<T> {
    (component: T, storyArgs?: { class?: string; }): any;
}
