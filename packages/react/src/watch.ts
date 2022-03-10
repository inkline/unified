import { WatchFn } from './types';
import { useEffect, useRef } from 'react';

export const watch: WatchFn = (dependency, callback) => {
    const mounted = useRef(false);

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }

        callback(dependency());
    }, [dependency()]);
};
