import { capitalizeFirst } from '@inkline/paper/helpers';
import { getSlotChildren, normalizeEventName } from '@inkline/paper/react/helpers';
/**
 * Define React component using Functional Component and named slots
 *
 * @param definition universal component definition
 */
export function defineComponent(definition) {
    const slots = {};
    const Component = (props) => {
        /**
         * Setup context
         */
        const setupContext = {
            /**
             * Emit event
             *
             * @param eventName
             * @param args
             */
            emit: (eventName, ...args) => {
                props[normalizeEventName(eventName)]?.(...args);
            }
        };
        /**
         * Render context
         */
        const renderContext = {
            slot(name = 'default') {
                const children = Array.isArray(props.children) ? props.children : [props.children];
                return getSlotChildren(name, slots, children);
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
        return definition.render(state, renderContext);
    };
    /**
     * Slots
     */
    ['default'].concat(definition.slots || []).forEach((name) => {
        slots[name] = () => null;
        slots[name].key = name;
        Component[capitalizeFirst(name)] = slots[name];
    });
    /**
     * Default props
     */
    if (definition.props) {
        Component.defaultProps = Object.keys(definition.props)
            .reduce((acc, propName) => {
            const propType = definition.props[propName];
            if (typeof propType === 'object' && propType.default) {
                acc[propName] = typeof propType.default === 'function'
                    ? propType.default()
                    : propType.default;
            }
            return acc;
        }, {});
    }
    return Component;
}
//# sourceMappingURL=defineComponent.jsx.map