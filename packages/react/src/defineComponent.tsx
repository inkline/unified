import {
    ComponentProps,
    RenderContext,
    SetupContext,
    Slots,
    EmitFn,
    HasSlotFn,
    SlotFn,
    ProvideFn,
    InjectFn,
    DefineReactComponentFn,
    UnwrapProps
} from './types';
import { FC, useEffect, useState } from 'react';
import { getSlotChildren, normalizeEventName, capitalizeFirst } from './helpers';
import { PaperContext } from './context';
import { h } from './h';

export type ReactFC<T> = FC<T & Record<string, any>> & { [key: string]: any };

/**
 * Define React component using Functional Component and named slots
 *
 * @param definition universal component definition
 */
export const defineComponent: DefineReactComponentFn = (
    definition
) => {
    const slots: Slots = {};

    const Component: ReactFC<UnwrapProps<typeof definition['props']>> = function (props) {
        /**
         * Render slot
         *
         * @param name
         */
        const slot: SlotFn = (name = 'default') => {
            const children = Array.isArray(props.children) ? props.children : [props.children];

            return getSlotChildren(name, slots, children);
        };

        /**
         * Helper to check if slots have children provided
         *
         * @param name
         */
        const hasSlot: HasSlotFn = (name = 'default') => {
            return slot(name).length > 0;
        };

        /**
         * Emit event
         *
         * @param eventName
         * @param args
         */
        const emit: EmitFn = (eventName, ...args) => {
            props[normalizeEventName(eventName)]?.(...args);
        };

        /**
         * Provide value to consumers
         *
         * @param identifier
         * @param value
         * @param dependencies
         */
        const provide: ProvideFn = (identifier, value, dependencies?) => {
            useEffect(() => {
                props.ctx.setProvides({
                    ...props.ctx.provides,
                    [identifier]: value
                });
            }, dependencies);
        };

        /**
         * Inject value from nearest provider
         *
         * @param identifier
         * @param defaultValue
         */
        const inject: InjectFn = (identifier, defaultValue) => {
            defaultValue = typeof defaultValue === 'function'
                ? (defaultValue as () => typeof defaultValue)()
                : defaultValue;

            let parent = props.ctx.parent;
            while (parent?.parent && !parent.provides.hasOwnProperty(identifier)) {
                parent = parent.parent;
            }

            if (parent?.provides.hasOwnProperty(identifier)) {
                return parent.provides[identifier];
            }

            return defaultValue;
        };

        /**
         * Setup context
         */
        const setupContext: SetupContext = {
            emit,
            hasSlot,
            provide,
            inject
        };

        /**
         * State and props
         */
        const state = definition.setup
            ? { ...props, ...definition.setup(props, setupContext) }
            : props;

        /**
         * Render context
         */
        const renderContext: RenderContext = {
            slot,
            hasSlot
        };

        /**
         * Render
         */
        return definition.render(state, renderContext);
    };

    /**
     * Default props
     */
    if (definition.props) {
        Component.defaultProps = Object.keys(definition.props)
            .reduce((acc: Partial<UnwrapProps<typeof definition['props']>>, propName) => {
                const propType = (definition.props as ComponentProps<any>)[propName];

                if (typeof propType === 'object' && propType.default) {
                    (acc as Record<string, any>)[propName] = typeof propType.default === 'function'
                        ? propType.default()
                        : propType.default;
                }

                return acc;
            }, {});
    }

    /**
     * Inject / Provide HOC used to create a parent-child relationship between paper components
     */
    const PaperComponent: ReactFC<UnwrapProps<typeof definition['props']>> = (props) => {
        const [provides, setProvides] = useState({});

        return <PaperContext.Consumer>{(parent: any) =>
            <PaperContext.Provider value={{ provides, setProvides, parent }}>
                <Component ctx={{ provides, setProvides, parent }} {...props} />
            </PaperContext.Provider>
        }</PaperContext.Consumer>;
    };

    /**
     * Slots
     */
    ['default'].concat(definition.slots?.filter((slotName) => slotName !== 'default') || [])
        .forEach((name) => {
            slots[name] = () => null;
            slots[name].key = name;
            PaperComponent[capitalizeFirst(name)] = slots[name];
        });

    return PaperComponent;
};
