import { SetupContext } from 'vue';
import { VNode } from '@inkline/ucd/vue/types';
import { ComponentContext, ComponentDefinition } from '@inkline/ucd/types';

/**
 * Define Vue component using Composition API and setup()
 *
 * @param definition universal component definition
 */
export function defineComponent<Props = {}, State = {}> (definition: ComponentDefinition<Props, State, VNode>) {
    return {
        emits: definition.emits || [],
        slots: definition.slots || [],
        props: definition.props || {},
        setup (props: Props, { slots, emit }: SetupContext) {
            const ctx: ComponentContext = {
                useSlot (name: string) {
                    return slots[name]!();
                },
                emit
            };

            const state = definition.setup
                ? { ...props, ...definition.setup(props, ctx) }
                : props as Props & State;

            return () => definition.render(state, ctx);
        }
    };
}
