import { ref as nativeRef } from 'vue';
import { RefFn } from './types';

export const ref: RefFn = (value) => nativeRef(value);
