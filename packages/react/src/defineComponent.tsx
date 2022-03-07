import {
    ComponentDefinition,
    ComponentProps,
    RenderContext,
    SetupContext,
    Slots,
    VNode
} from './types';
import { FC, PropsWithChildren } from 'react';
import { getSlotChildren, normalizeEventName, capitalizeFirst } from './helpers';

export type ReactFC<T> = FC<T & Record<string, any>> & { [key: string]: any };

/**
 * Define React component using Functional Component and named slots
 *
 * @param definition universal component definition
 */
export function defineComponent<
    Props = Record<string, any>,
    State = Record<string, any>
> (
    definition: ComponentDefinition<PropsWithChildren<Props>, State, VNode>
): ReactFC<Props> {
    const slots: Slots = {};

    const Component: ReactFC<Props> = (props) => {
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
            .reduce((acc: Partial<Props>, propName) => {
                const propType = (definition.props as ComponentProps<any>)[propName];

                if (typeof propType === 'object' && propType.default) {
                    (acc as Record<string, any>)[propName] = typeof propType.default === 'function'
                        ? propType.default()
                        : propType.default;
                }

                return acc;
            }, {});
    }

    return Component;
};
