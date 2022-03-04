import { useEffect, useState } from 'react';
/**
 * Global providers, identified uniquely using a symbol or string
 */
const providers = {};
/**
 * Register provider
 *
 * @param identifier
 * @param value
 */
function registerProvider(identifier, value) {
    providers[identifier] = {
        state: value,
        setState(newValue) {
            providers[identifier].state = newValue;
        },
        notify() { }
    };
}
/**
 * Update provider
 *
 * @param identifier
 * @param value
 */
function updateProvider(identifier, value) {
    providers[identifier].setState(value);
    providers[identifier].notify(value);
}
/**
 * Provide value to consumers
 *
 * @param identifier
 * @param value
 */
export const provide = (identifier, value) => {
    useEffect(() => {
        if (providers[identifier]) {
            updateProvider(identifier, value);
        }
        else {
            registerProvider(identifier, value);
        }
    });
};
/**
 * Inject value from providers
 *
 * @param identifier
 * @param defaultValue
 */
export const inject = (identifier, defaultValue) => {
    const [, setState] = useState();
    if (!providers[identifier]) {
        defaultValue = typeof defaultValue === 'function'
            ? defaultValue()
            : defaultValue;
        registerProvider(identifier, defaultValue);
    }
    providers[identifier].notify = setState;
    return providers[identifier].state;
};
//# sourceMappingURL=provide.js.map