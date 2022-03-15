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
    if (typeof type === 'function' && typeof children[0] === 'object' && !Array.isArray(children[0]) && !(children[0] as any).$$typeof) {
        children = Object.entries(children[0] as Record<string, () => VNode>)
            .map(([rawSlotName, childrenFn]) => {
                const slotName = capitalizeFirst(rawSlotName);
                const slotComponent = (type as FC<any> & { [key: string]: any })[slotName];

                return h(slotComponent, { key: slotName }, childrenFn());
            });
    }

    return createElement(type, props, ...children);
};
