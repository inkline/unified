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
