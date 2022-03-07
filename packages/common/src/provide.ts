import { InjectFn, ProvideFn } from './types';

export const provide: ProvideFn = (identifier, value, dependencies?) => {};
export const inject: InjectFn = (identifier, defaultValue) => {};
