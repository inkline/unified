import { Slots, VNode } from '@inkline/ucd/react/types';
import { ComponentContext, ComponentDefinition, ComponentProps } from '@inkline/ucd/types';
import { PropsWithChildren } from 'react';
import { capitalizeFirst } from '@inkline/ucd/helpers';
import { getSlotChildren } from '@inkline/ucd/react/helpers';

/**
 * Define React component using Functional Component and named slots
 *
 * @param definition universal component definition
 */
export function defineComponent<Props = {}, State = {}> (definition: ComponentDefinition<Props, State, VNode>) {
    const slots: Slots = {};

    const Component: {
        (props: PropsWithChildren<Props>, context?: any): VNode;
        [key: string]: any;
    } = (props) => {
        const ctx: ComponentContext = {
            emit: () => {},
            useSlot (name: string = 'default') {
                const children = Array.isArray(props.children) ? props.children : [props.children];

                return getSlotChildren(name, slots, children);
            }
        };

        const state = definition.setup
            ? { ...props, ...definition.setup(props, ctx) }
            : props as Props & State;

        return definition.render(state, ctx);
    };

    /**
     * Slots
     */
    ['default'].concat(definition.slots || []).forEach((name) => {
        slots[name] = () => null;
        slots[name].key = name;
        Component[capitalizeFirst(name)] = slots[name];
    });

    /**
     * Default props
     */
    if (definition.props) {
        Component.defaultProps = Object.keys(definition.props)
            .reduce((acc, propName) => {
                const propType = (definition.props as ComponentProps<any>)[propName];

                if (typeof propType === 'object' && propType.default) {
                    acc[propName] = typeof propType.default === 'function'
                        ? propType.default()
                        : propType.default;
                }

                return acc;
            }, {} as Record<string, any>);
    }

    return Component;
}
