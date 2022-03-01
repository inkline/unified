import { Ref } from '@inkline/ucd/types';

export function computed<T> (computeFn: () => T): Ref<T> {
    return {
        get value () {
            return computeFn();
        }
    };
}
