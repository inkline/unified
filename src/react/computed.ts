import { Ref } from '@inkline/paper/types';
import { useMemo } from 'react';

export function computed<T> (computeFn: () => T, dependencies?: any[]): Ref<T> {
    const value = useMemo(() => computeFn(), dependencies);

    return {
        get value () {
            return value;
        }
    };
}
