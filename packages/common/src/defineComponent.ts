import {
    EmitFn,
    HasSlotFn,
    RenderContext,
    SetupContext,
    SlotFn,
    DefineComponentFn, InjectFn, ProvideFn
} from './types';

export const defineComponent: DefineComponentFn<Record<string, any>, Record<string, any>> = (definition) => {
    return (props: any) => {
        const slot: SlotFn = (name = 'default') => {
            console.log(`slot(${name})`);
            return [];
        };

        const hasSlot: HasSlotFn = (name = 'default') => {
            return slot(name).length > 0;
        };

        const emit: EmitFn = (eventName, ...args) => {
            console.log(`emit(${event})`, ...args);
        };

        const provide: ProvideFn = (identifier, value) => {
            console.log(`provide(${identifier.toString()}, ${value})`);
            return value;
        };

        const inject: InjectFn = (identifier, defaultValue) => {
            console.log(`inject(${identifier.toString()}, ${defaultValue})`);
            return defaultValue;
        };

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
