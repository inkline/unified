import { FragmentFn } from './types-common';
import { VNode } from './types';

/**
 * Render child elements using Fragment
 *
 * @example <></>
 */
export const Fragment: FragmentFn<VNode> = (props, ...args) => {
    console.log(props, args)
    return props.children;
};
