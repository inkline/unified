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

export interface ComponentContext {
    useSlot(name?: string): any;
    emit: (...args: any[]) => void
}

export interface ComponentDefinition<Props extends Record<string, any> = {}, State extends Record<string, any> = {}, VNode = any> {
    slots?: string[];
    emits?: string[];
    props?: ComponentProps<Props>;
    setup?(props: Props, context: ComponentContext): State;
    render(state: Props & State, context: ComponentContext): VNode;
}
