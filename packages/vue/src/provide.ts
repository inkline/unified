import { provide as nativeProvide, inject as nativeInject } from 'vue';
import { InjectFn, ProvideFn } from './types';

export const provide: ProvideFn = nativeProvide;

export const inject: InjectFn = nativeInject;
