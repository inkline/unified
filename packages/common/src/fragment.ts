import { FragmentFn } from './types';

export const Fragment: FragmentFn<any> = (props) => {
    return props.children;
};
