/**
 * Provide value to consumers
 *
 * @param identifier
 * @param value
 */
export declare const provide: <T>(identifier: string | symbol, value: T) => void;
/**
 * Inject value from providers
 *
 * @param identifier
 * @param defaultValue
 */
export declare const inject: <T>(identifier: string | symbol, defaultValue?: T | (() => T) | undefined) => T | undefined;
