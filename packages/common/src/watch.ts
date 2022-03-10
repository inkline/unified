import { WatchFn } from './types';

export const watch: WatchFn = (dependency, callback) => {
    callback(dependency);
};
