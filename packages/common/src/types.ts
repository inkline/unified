export type Ref<T> = { value: T };

export type UnwrapState<State> = {
    [key in keyof State]: (State[key] & Ref<State[key]>)['value']
};

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

export interface SetupContext {
    emit: (eventName: string, ...args: any[]) => void
}

export interface RenderContext {
    slot(name?: string): any;
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

export interface HoistFn<T = any, C = any> {
    (type: string | C, props?: Record<string, any>, children?: (string | number | boolean | T)[]): T
}

export interface ProvideFn<T = any> {
    (identifier: string | symbol, value: T, dependencies?: any[]): void;
}

export interface InjectFn<T = any> {
    (identifier: string | symbol, defaultValue?: T | (() => T)): T | undefined
}