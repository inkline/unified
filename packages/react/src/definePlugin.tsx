import { DefineReactPluginFn, ProvideFn } from './types';
import { PaperContext } from './context';
import { h } from './h';
import { Component, PureComponent, useEffect, useState } from 'react';

class GlobalParent extends Component<any, any> {
    provides: Record<string | symbol, any> = {};
}

export const definePlugin: DefineReactPluginFn = (setup) => class extends Component<{ options: any }, {}> {
    provides: Record<string | symbol, any> = {};

    constructor (props: any) {
        super(props);

        const provide: ProvideFn = (identifier, value) => {
            console.log(identifier, value)

            this.provides[identifier] = value;
            this.setState(this.provides);
        };

        setup(props.options, {
            provide
        });
    }

    render () {
        return <PaperContext.Provider value={this}>
            {this.props.children}
        </PaperContext.Provider>;
    }
};

// export const definePlugin: DefineReactPluginFn = (setup) => ({ children, options }) => {
//     const [provides, setProvides] = useState<Record<string | symbol, any>>({});
//
//     /**
//      * Provide value to whole application
//      *
//      * @param identifier
//      * @param value
//      */
//     const provide: ProvideFn = (identifier, value) => {
//         useEffect(() => {
//             setProvides({
//                 ...provides,
//                 [identifier]: value
//             });
//         }, [provides]);
//     };
//
//     /**
//      * Setup the plugin
//      */
//
//     setup(options || {}, { provide });
//
//     /**
//      * Render the child components array as-is
//      */
//     return <PaperContext.Provider value={{}}>
//         {children}
//     </PaperContext.Provider>;
// };
