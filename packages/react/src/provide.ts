import { useEffect, useState } from 'react';
import { InjectFn, ProvideFn, Providers, RegisterProviderFn, UpdateProviderFn } from './types';

/**
 * Global providers, identified uniquely using a symbol or string
 */
const providers: Providers = {};

/**
 * Register provider
 *
 * @param identifier
 * @param value
 */
export const registerProvider: RegisterProviderFn = (identifier, value) => {
    providers[identifier] = {
        state: value,
        setState (newValue: any) {
            providers[identifier].state = newValue;
        },
        notify () {}
    };
};

/**
 * Update provider
 *
 * @param identifier
 * @param value
 */
export const updateProvider: UpdateProviderFn = (identifier, value) => {
    providers[identifier].setState(value);
    providers[identifier].notify(value);
};

/**
 * Provide value to consumers
 *
 * @param identifier
 * @param value
 * @param dependencies
 */
export const provide: ProvideFn = (identifier, value, dependencies?) => {
    useEffect(() => {
        if (providers[identifier]) {
            updateProvider(identifier, value);
        } else {
            registerProvider(identifier, value);
        }
    }, dependencies);
};

/**
 * Inject value from providers
 *
 * @param identifier
 * @param defaultValue
 */
export const inject: InjectFn = (identifier, defaultValue) => {
    const [, setState] = useState();

    if (!providers[identifier]) {
        defaultValue = typeof defaultValue === 'function'
            ? (defaultValue as () => any)()
            : defaultValue;

        registerProvider(identifier, defaultValue);
    }

    providers[identifier].notify = setState;

    return providers[identifier].state;
};
