import { Slots } from '@inkline/paper/react/types';
/**
 * Retrieve children for given named slot. If retrieving for 'default' slot, retrieve direct un-slotted children as well
 *
 * @param name
 * @param slots
 * @param children
 */
export declare const getSlotChildren: (name: string, slots: Slots, children: JSX.Element[]) => JSX.Element[];
export declare const normalizeEventName: (name: string) => string;
