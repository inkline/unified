import {Slots} from "../types";

/**
 * Retrieve children for given named slot. If retrieving for 'default' slot, retrieve direct un-slotted children as well
 *
 * @param name
 * @param slots
 * @param children
 */
export const getSlotChildren = (name: string, slots: Slots, children: JSX.Element[]): JSX.Element[] => {
    const isSlot = (el: JSX.Element) => typeof el.type === 'function' && Object.keys(slots).find((slotName) => el.type === slots[slotName]);

    return children
        .filter((el) => {
            const matchesNamedSlot = typeof el.type === 'function' && (el.type as any) === slots[name];

            return name === 'default' ? matchesNamedSlot || !isSlot(el) : matchesNamedSlot;
        })
        .map((el) => {
            return isSlot(el) ? el.props?.children || [] : el;
        })
        .flat();
};
