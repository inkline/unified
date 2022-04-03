import { SetupContext as VueSetupContext } from 'vue';
import { SetupContext, RenderContext, DefineVueComponentFn, SlotFn, HasSlotFn } from './types';
import { provide as nativeProvide, inject as nativeInject } from 'vue';
import { InjectFn, ProvideFn } from './types';

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
        setup (props, { attrs, slots, emit }: VueSetupContext) {
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
             * Wrapper for native Vue provide function
             *
             * @param identifier
             * @param value
             */
            const provide: ProvideFn = (identifier, value) => nativeProvide(identifier, value);

            /**
             * Wrapper for native Vue inject function
             *
             * @param identifier
             * @param defaultValue
             */
            const inject: InjectFn = (identifier, defaultValue?) => nativeInject(identifier, defaultValue);

            /**
             * Setup context
             */
            const setupContext: SetupContext = {
                emit,
                provide,
                inject,
                hasSlot
            };

            /**
             * State and props
             */
            let state = {
                ...attrs,
                ...props
            };

            if (definition.setup) {
                state = Object.assign(state, definition.setup(state, setupContext));
            }

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
