import { useState } from 'react';
import { Ref } from '@inkline/ucd/types';

export function ref<T> (initialValue: T): Ref<T> {
    const [state, setState] = useState<T>(initialValue);

    return {
        get value () {
            return state;
        },
        set value (value: T) {
            setState(value);
        }
    };
}
