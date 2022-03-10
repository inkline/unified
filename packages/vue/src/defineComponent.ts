import { SetupContext as VueSetupContext } from 'vue';
import { SetupContext, RenderContext, DefineVueComponentFn, SlotFn, HasSlotFn } from './types';

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
             * Render slot
             *
             * @param name
             */
            const slot: SlotFn = (name = 'default') => {
                return slots[name]?.();
            };

            /**
             * Helper to check if slots have children provided
             *
             * @param name
             */
            const hasSlot: HasSlotFn = (name = 'default') => {
                return !!slots[name];
            };

            /**
             * Setup context
             */
            const setupContext: SetupContext = {
                emit,
                hasSlot
            };

            /**
             * State and props
             */
            const state = definition.setup
                ? { ...props, ...definition.setup(props, setupContext) }
                : props;

            /**
             * Render context
             */
            const renderContext: RenderContext = {
                slot,
                hasSlot
            };

            /**
             * Render
             */
            return () => definition.render(state, renderContext);
        }
    };
};
