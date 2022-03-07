import { Slots, VNode } from '@inkline/paper/react/types';
import { ComponentDefinition, ComponentProps, RenderContext, SetupContext } from '@inkline/paper/types';
import { PropsWithChildren } from 'react';
import { capitalizeFirst } from '@inkline/paper/helpers';
import { getSlotChildren, normalizeEventName } from '@inkline/paper/react/helpers';

/**
 * Define React component using Functional Component and named slots
 *
 * @param definition universal component definition
 */
export function defineComponent<Props extends Record<string, any> = {}, State extends Record<string, any> = {}> (
    definition: ComponentDefinition<Props, State, VNode>
) {
    const slots: Slots = {};

    const Component: {
        (props: PropsWithChildren<Props>, context?: any): VNode;
        [key: string]: any;
    } = (props) => {
        /**
         * Setup context
         */
        const setupContext: SetupContext = {
            /**
             * Emit event
             *
             * @param eventName
             * @param args
             */
            emit: (eventName, ...args) => {
                props[normalizeEventName(eventName)]?.(...args);
            }
        };

        /**
         * Render context
         */
        const renderContext: RenderContext = {
            slot (name: string = 'default') {
                const children = Array.isArray(props.children) ? props.children : [props.children];

                return getSlotChildren(name, slots, children);
            }
        };

        /**
         * State and props
         */
        const state = definition.setup
            ? { ...props, ...definition.setup(props, setupContext) }
            : props as Props & State;

        /**
         * Render
         */
        return definition.render(state, renderContext);
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
