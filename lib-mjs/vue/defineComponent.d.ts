import { SetupContext as VueSetupContext } from 'vue';
import { VNode } from '@inkline/paper/vue/types';
import { ComponentDefinition } from '@inkline/paper/types';
/**
 * Define Vue component using Composition API and setup()
 *
 * @param definition universal component definition
 */
export declare function defineComponent<Props extends Record<string, any> = {}, State extends Record<string, any> = {}>(definition: ComponentDefinition<Props, State, VNode>): {
    emits: string[];
    slots: string[];
    props: {};
    setup(props: Props, { slots, emit }: VueSetupContext): () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
};
