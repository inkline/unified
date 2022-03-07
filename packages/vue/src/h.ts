import { h as nativeH } from 'vue';
import { HoistFn } from './types';

export const h: HoistFn = (type, props?, children?) => nativeH(type, props, children);
