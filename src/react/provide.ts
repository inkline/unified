import { useEffect, useState } from 'react';

/**
 * Global providers, identified uniquely using a symbol or string
 */
const providers: {
    [key: string | symbol]: {
        state: any;
        setState(newValue: any): void;
        notify(newValue: any): void;
    };
} = {};

/**
 * Register provider
 *
 * @param identifier
 * @param value
 */
function registerProvider <T> (identifier: string | symbol, value: T): void {
    providers[identifier] = {
        state: value,
        setState (newValue: any) {
            providers[identifier].state = newValue;
        },
        notify () {}
    };
}

/**
 * Update provider
 *
 * @param identifier
 * @param value
 */
function updateProvider <T> (identifier: string | symbol, value: T): void {
    providers[identifier].setState(value);
    providers[identifier].notify(value);
}

/**
 * Provide value to consumers
 *
 * @param identifier
 * @param value
 * @param dependencies
 */
export const provide = <T>(identifier: string | symbol, value: T, dependencies: any[] = []): void => {
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
export const inject = <T>(identifier: string | symbol, defaultValue?: T | (() => T)): T | undefined => {
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
