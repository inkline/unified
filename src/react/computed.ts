import { Ref } from '@inkline/paper/types';

export function computed<T> (computeFn: () => T): Ref<T> {
    return {
        get value () {
            return computeFn();
        }
    };
}
