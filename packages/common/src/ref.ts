import { RefFn } from './types';

export const ref: RefFn = (initialValue) => {
    return {
        get value () {
            return initialValue;
        },
        set value (value) {}
    };
};
