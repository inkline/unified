import { capitalizeFirst } from './capitalizeFirst';

export const normalizeEventName = (name: string): string => {
    return `on${name.split(':').map((part) => capitalizeFirst(part)).join('')}`;
};
