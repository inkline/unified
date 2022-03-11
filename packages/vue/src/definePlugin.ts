import { DefineVuePluginFn } from './types';

export const definePlugin: DefineVuePluginFn = (setup) => ({
    install (app, options) {
        /**
         * Register components provided through options globally
         */

        for (const componentIndex in options?.components) {
            if (options.components[componentIndex].name) {
                app.component(options.components[componentIndex].name, options.components[componentIndex]);
            }
        }

        /**
         * Setup the plugin
         */

        setup(options, {
            provide: (identifier, data) => {
                app.config.globalProperties[`$${typeof identifier === 'symbol' ? identifier.description : identifier}`] = data;
                app.provide(identifier, data);
            }
        });
    }
});
