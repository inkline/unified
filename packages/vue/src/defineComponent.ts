import { SetupContext as VueSetupContext } from 'vue';
import { SetupContext, RenderContext, DefineVueComponentFn } from './types';

/**
 * Define Vue component using Composition API and setup()
 *
 * @param definition universal component definition
 */

export const defineComponent: DefineVueComponentFn = (definition) => {
    return {
        name: definition.name || '',
        emits: definition.emits || [],
        slots: definition.slots || [],
        props: definition.props || {},
        setup (props, { slots, emit }: VueSetupContext) {
            /**
             * Render context
             */
            const renderContext: RenderContext = {
                slot (name = 'default') {
                    return slots[name]?.();
                }
            };

            /**
             * Setup context
             */
            const setupContext: SetupContext = {
                emit,
                slot (name = 'default') {
                    return !!slots[name];
                }
            };

            /**
             * State and props
             */
            const state = definition.setup
                ? { ...props, ...definition.setup(props, setupContext) }
                : props;

            /**
             * Render
             */
            return () => definition.render(state, renderContext);
        }
    };
};
