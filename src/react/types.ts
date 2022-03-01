export type VNode = JSX.Element;

export interface ComponentContext {
    useSlot: (name: string) => void;
}

export type ConstructorType =
    | NumberConstructor
    | StringConstructor
    | BooleanConstructor
    | ObjectConstructor
    | ArrayConstructor;

export type ComponentProps<Props> = {
    [key in keyof Props]: ConstructorType | {
        type: ConstructorType;
        default?: Props[key] | (() => Props[key]);
    };
}

export interface ComponentDefinition<Props, State> {
    props?: ComponentProps<Props>;
    setup?(props: Props): State;
    render(state: Props & State, context: ComponentContext): VNode;
}
