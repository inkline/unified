import { computed as nativeComputed } from 'vue';
import { ComputedFn } from './types';

export const computed: ComputedFn = (computeFn) => nativeComputed(computeFn);
