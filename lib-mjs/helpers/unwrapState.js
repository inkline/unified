export function unwrapState(state) {
    const newState = {};
    Object.keys(state || {}).forEach((stateKey) => {
        if (typeof state[stateKey] !== 'function' &&
            typeof state[stateKey] === 'object' &&
            (state[stateKey].hasOwnProperty('value') || state[stateKey].hasOwnProperty('_value'))) {
            newState[stateKey] = state[stateKey].value;
        }
        else {
            newState[stateKey] = state[stateKey];
        }
    });
    return newState;
}
//# sourceMappingURL=unwrapState.js.map