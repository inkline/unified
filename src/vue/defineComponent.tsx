import { SetupContext } from 'vue';
import { ComponentDefinition } from '@inkline/ucd/vue';

export function defineComponent<Props, State> (definition: ComponentDefinition<Props, State>) {
    return {
        props: definition.props || {},
        setup (props: Props, { slots, emit }: SetupContext) {
            const ctx = {
                useSlot (name: string) {
                    return ctx.slots[name]!();
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
