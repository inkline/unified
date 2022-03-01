import { ComponentDefinition, VNode } from '@inkline/ucd/react';

export function defineComponent<Props extends Record<string, any>, State> (definition: ComponentDefinition<Props, State>) {
    const Component = (props: Props & { children: JSX.Element[] }): VNode => {
        const state = definition.setup
            ? { ...props, ...definition.setup(props) }
            : props as Props & State;

        const context = {
            useSlot (name: string) {
                const Slot = () => null;

                (Component as any)[name] = Slot;

                return props.children.find(el => el.type === Slot);
            }
        };

        return definition.render(state, context);
    };

    if (definition.props) {
        Component.defaultProps = Object.entries(definition.props)
            .reduce((acc, [propName, propType]) => {
                if (propType.default) {
                    acc[propName] = typeof propType.default === 'function'
                        ? propType.default()
                        : propType.default;
                }

                return acc;
            }, {} as Record<string, any>);
    }

    return Component;
}
