import { createElement, FC } from 'react';
import { VNode, HoistFn } from './types';

export const h: HoistFn<VNode, FC<any>> = (
    type,
    props?,
    children?
) => {
    // Rename class to className
    if (props?.class) {
        const { class: className, ...properties } = props;
        props = properties;
        props.className = className;
    }

    return createElement(type, props, children);
};
