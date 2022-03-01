import React from 'react';
import { VNode } from '@inkline/ucd/react/types';

export function h (
    type: string,
    props?: any,
    children?: (VNode | string | number | boolean)[]
): VNode {
    return React.createElement(type, props, children) as VNode;
}
