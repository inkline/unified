import { UnwrapState } from '@inkline/paper/types';

export function unwrapState<State extends Record<string, any>> (state: State): UnwrapState<State> {
    const newState: Record<string, any> = {};

    Object.keys(state || {}).forEach((stateKey) => {
        if (
            typeof state[stateKey] !== 'function' &&
            typeof state[stateKey] === 'object' &&
            (state[stateKey].hasOwnProperty('value') || state[stateKey].hasOwnProperty('_value'))
        ) {
            newState[stateKey] = state[stateKey].value;
        } else {
            newState[stateKey] = state[stateKey];
        }
    });

    return newState as UnwrapState<State>;
}
