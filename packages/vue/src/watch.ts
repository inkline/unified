import { watch as nativeWatch } from 'vue';
import { WatchFn } from './types';

export const watch: WatchFn = (dependency, callback) => nativeWatch(dependency, callback);
