import { SetupContext as VueSetupContext, provide, inject } from 'vue';
import { VNode } from '@inkline/paper/vue/types';
import { ComponentDefinition, SetupContext, RenderContext } from '@inkline/paper/types';

/**
 * Define Vue component using Composition API and setup()
 *
 * @param definition universal component definition
 */
export function defineComponent<Props extends Record<string, any> = {}, State extends Record<string, any> = {}> (
    definition: ComponentDefinition<Props, State, VNode>
) {
    return {
        emits: definition.emits || [],
        slots: definition.slots || [],
        props: definition.props || {},
        setup (props: Props, { slots, emit }: VueSetupContext) {
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
                : props as Props & State;

            return () => definition.render(state, renderContext);
        }
    };
}
