import { capitalizeFirst } from './capitalizeFirst';

export const normalizeEventName = (name: string): string => {
    return `on${capitalizeFirst(name)}`;
};
