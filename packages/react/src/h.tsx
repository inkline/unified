import React from 'react';
import { VNode, HoistFn } from './types';

export const h: HoistFn<VNode> = (type, props?, children?) => {
    return React.createElement(type, props, children);
};
