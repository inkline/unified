import { createElement, FC } from 'react';
import { VNode, HoistFn } from './types';

export const h: HoistFn<VNode, FC<any>> = (
    type,
    props?,
    children?
) => createElement(type, props, children);
