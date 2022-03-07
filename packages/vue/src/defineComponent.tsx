import { SetupContext as VueSetupContext } from 'vue';
import { SetupContext, RenderContext, DefineVueComponentFn } from './types';

/**
 * Define Vue component using Composition API and setup()
 *
 * @param definition universal component definition
 */

export const defineComponent: DefineVueComponentFn = (definition) => {
    return {
        emits: definition.emits || [],
        slots: definition.slots || [],
        props: definition.props || {},
        setup (props, { slots, emit }: VueSetupContext) {
            const setupContext: SetupContext = {
                emit
            };

            const renderContext: RenderContext = {
                slot (name: string = 'default') {
                    return slots[name]?.();
                }
            };

            const state = definition.setup
                ? { ...props, ...definition.setup(props, setupContext) }
                : props;

            return () => definition.render(state, renderContext);
        }
    };
};
