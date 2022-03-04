import { useState } from 'react';
export function ref(initialValue) {
    const [state, setState] = useState(initialValue);
    return {
        get value() {
            return state;
        },
        set value(value) {
            setState(value);
        }
    };
}
//# sourceMappingURL=ref.js.map