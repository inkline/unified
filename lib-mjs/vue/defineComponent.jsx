/**
 * Define Vue component using Composition API and setup()
 *
 * @param definition universal component definition
 */
export function defineComponent(definition) {
    return {
        emits: definition.emits || [],
        slots: definition.slots || [],
        props: definition.props || {},
        setup(props, { slots, emit }) {
            const setupContext = {
                emit
            };
            const renderContext = {
                slot(name = 'default') {
                    return slots[name]?.();
                }
            };
            const state = definition.setup
                ? { ...props, ...definition.setup(props, setupContext) }
                : props;
            return () => definition.render(state, renderContext);
        }
    };
}
//# sourceMappingURL=defineComponent.jsx.map