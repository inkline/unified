import { createElement, FC } from 'react';
import { VNode, HoistFn } from './types';
import { capitalizeFirst } from './helpers';

/**
 * Render native element or React.js component
 *
 * @example h('p', { class: 'paragraph' }, 'Hello world')
 */
export const h: HoistFn<VNode, FC<any>> = (
    type,
    props?,
    ...children
) => {
    /**
     * Rename class to className
     *
     * @example h(type, { class: 'element' }) => h(type, { className: 'element' })
     */
    if (props?.class) {
        const { class: className, ...properties } = props;
        props = properties;
        props.className = className;
    }

    /**
     * Handle passing slots to component when using render function
     *
     * @example h(Component, {}, { slotName: () => children });
     */
    if (typeof type !== 'string' && typeof children[0] === 'object' && !Array.isArray(children[0]) && !(children[0] as any).$$typeof) {
        const slots = children[0] as Record<string, () => VNode>;
        const slotKeys = Object.keys(slots);

        if (slotKeys.length === 1 && slotKeys[0] === 'default') {
            children = [slots.default()].flat();
        } else {
            children = slotKeys
                .map((slotKey) => {
                    const slotName = capitalizeFirst(slotKey);
                    const slotComponent = (type as FC<any> & { [key: string]: any })[slotName];

                    return h(slotComponent, { key: slotName }, slots[slotKey]());
                });
        }
    }

    return createElement(type, props, ...children);
};
