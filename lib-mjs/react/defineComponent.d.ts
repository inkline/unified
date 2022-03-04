import { VNode } from '@inkline/paper/react/types';
import { ComponentDefinition } from '@inkline/paper/types';
import { PropsWithChildren } from 'react';
/**
 * Define React component using Functional Component and named slots
 *
 * @param definition universal component definition
 */
export declare function defineComponent<Props extends Record<string, any> = {}, State extends Record<string, any> = {}>(definition: ComponentDefinition<Props, State, VNode>): {
    (props: PropsWithChildren<Props>, context?: any): VNode;
    [key: string]: any;
};
