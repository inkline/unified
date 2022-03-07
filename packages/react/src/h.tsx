import React from 'react';
import { VNode } from '@inkline/paper/react/types';

export function h (
    type: string,
    props?: any,
    children?: (string | number | boolean | VNode)[]
): VNode {
    return React.createElement(type, props, children) as VNode;
}
