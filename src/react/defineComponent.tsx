import { Slots, VNode } from '@inkline/ucd/react/types';
import { ComponentDefinition, ComponentProps, RenderContext, SetupContext } from '@inkline/ucd/types';
import {PropsWithChildren, useEffect, useRef, useState} from 'react';
import { capitalizeFirst } from '@inkline/ucd/helpers';
import { getSlotChildren, normalizeEventName } from '@inkline/ucd/react/helpers';

/**
 * Global providers, identified uniquely using a symbol or string
 */
const providers: {
    [key: string | symbol]: {
        state: any;
        setState(newValue: any): void;
        notify(newValue: any): void;
    };
} = {};

/**
 * Register provider
 *
 * @param identifier
 * @param value
 */
function registerProvider <T> (identifier: string | symbol, value: T): void {
    providers[identifier] = {
        state: value,
        setState (newValue: any) {
            providers[identifier].state = newValue;
        },
        notify () {}
    };
}

/**
 * Update provider
 *
 * @param identifier
 * @param value
 */
function updateProvider <T> (identifier: string | symbol, value: T): void {
    providers[identifier].setState(value);
    providers[identifier].notify(value);
}

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
            },
            /**
             * Provide value to consumers
             *
             * @param identifier
             * @param value
             */
            provide: (identifier, value) => {
                useEffect(() => {
                    if (providers[identifier]) {
                        updateProvider(identifier, value);
                    } else {
                        registerProvider(identifier, value);
                    }
                });
            },
            /**
             * Inject value from providers
             *
             * @param identifier
             * @param defaultValue
             */
            inject: (identifier, defaultValue) => {
                const [, setState] = useState();

                defaultValue = typeof defaultValue === 'function' ? (defaultValue as () => any)() : defaultValue;

                if (!providers[identifier]) {
                    registerProvider(identifier, defaultValue);
                }

                providers[identifier].notify = setState;
                return providers[identifier].state;
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
