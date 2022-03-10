import {
    EmitFn,
    HasSlotFn,
    RenderContext,
    SetupContext,
    SlotFn,
    DefineComponentFn
} from './types';

export const defineComponent: DefineComponentFn<any, any> = (definition) => {
    return (props: any) => {
        const slot: SlotFn = (name = 'default') => {
            return [];
        };

        const hasSlot: HasSlotFn = (name = 'default') => {
            return slot(name).length > 0;
        };

        const emit: EmitFn = (eventName, ...args) => {};

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
        return definition.render(state, renderContext);
    };
};
