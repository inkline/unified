import { defineComponent, h } from '@inkline/ucd/vue';

export interface Props {}

export default defineComponent<Props>({
    setup (props) {
        return () => h('h1', {}, []);
    }
});
