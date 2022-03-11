import { DefineReactPluginFn } from './types';
import { provide } from './provide';

export const definePlugin: DefineReactPluginFn = (setup) => ({ children, options }) => {
    /**
     * Setup the plugin
     */

    setup(options, { provide });

    /**
     * Render the child components array as-is
     */
    return children;
};
