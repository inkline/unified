export function computed(computeFn) {
    return {
        get value() {
            return computeFn();
        }
    };
}
//# sourceMappingURL=computed.js.map