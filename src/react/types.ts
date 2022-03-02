export type VNode = JSX.Element | null;

export type Slots = { [key: string]: { (): null; key?: string; } };
