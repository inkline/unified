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

export interface ComponentDefinition<Props extends Record<string, any> = {}, State extends Record<string, any> = {}, VNode = any> {
    slots?: string[];
    emits?: string[];
    props?: ComponentProps<Props>;
    setup?(props: Props, context: SetupContext): State;
    render(state: Props & State, context: RenderContext): VNode;
}
