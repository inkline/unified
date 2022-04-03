import { createContext, Dispatch, SetStateAction } from 'react';

interface PaperContextState {
    provides: Record<string, any>;
    setProvides: Dispatch<SetStateAction<Record<string, any>>>;
    parent: PaperContextState;
}

export const PaperContext = createContext<PaperContextState | null>(null);
