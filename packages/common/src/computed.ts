import { ComputedFn } from './types';

export const computed: ComputedFn = (computeFn) => {
    return {
        get value () {
            return computeFn();
        }
    };
};
