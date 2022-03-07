import { useState } from 'react';
import { RefFn } from './types';

export const ref: RefFn = (initialValue) => {
    const [state, setState] = useState(initialValue);

    return {
        get value () {
            return state;
        },
        set value (value) {
            setState(value);
        }
    };
};
