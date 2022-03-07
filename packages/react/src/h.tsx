import React, { FC } from 'react';
import { VNode, HoistFn } from './types';

export const h: HoistFn<VNode, FC<any>> = (
    type,
    props?,
    children?
) => React.createElement(type, props, children);
