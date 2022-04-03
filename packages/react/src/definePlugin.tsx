import { DefineReactPluginFn, ProvideFn } from './types';
import { PaperContext } from './context';
import { h } from './h';
import { useEffect, useState } from 'react';

export const definePlugin: DefineReactPluginFn = (setup) => ({ children, options }) => {
    const [provides, setProvides] = useState({});

    /**
     * Provide value to whole application
     *
     * @param identifier
     * @param value
     * @param dependencies
     */
    const provide: ProvideFn = (identifier, value, dependencies = []) => {
        useEffect(() => {
            setProvides({
                ...provides,
                [identifier]: value
            });
        }, dependencies);
    };

    /**
     * Setup the plugin
     */

    setup(options || {}, { provide });

    /**
     * Render the child components array as-is
     */
    return <PaperContext.Provider value={{ provides, setProvides }}>
        {children}
    </PaperContext.Provider>;
};
