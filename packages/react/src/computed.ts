import { ComputedFn } from './types';
import { useMemo } from 'react';

export const computed: ComputedFn = (computeFn, dependencies) => {
    const value = useMemo(() => computeFn(), dependencies);

    return {
        get value () {
            return value;
        }
    };
};
