import { provide as nativeProvide, inject as nativeInject } from 'vue';
import { InjectFn, ProvideFn } from './types';

export const provide: ProvideFn = (identifier, value) => nativeProvide(identifier, value);

export const inject: InjectFn = (identifier, value) => nativeInject(identifier, value);
