import { VNode } from 'vue';
import { ComponentProps } from '@inkline/ucd/types';

export interface ComponentContext {
    slots: {
        [key: string]: () => Element
    };
    attrs: Record<string, any>;
    emit: (...args: any[]) => void
}

export interface ComponentDefinition<Props, State> {
    props?: ComponentProps<Props>;
    setup?(props: Props, context: ComponentContext): State;
    render(state: Props & State, context: ComponentContext): VNode;
}
