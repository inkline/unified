<p align="center">
    <a href="http://inkline.io/">
        <img src="https://raw.githubusercontent.com/inkline/inkline.io/main/src/assets/images/logo/logo-black.svg" alt="Inkline logo" width=72 height=72>
    </a>
</p>

<h1 align="center">Inkline - Paper</h1>

<p align="center">
    Unified interface for defining components for both Vue and React using the a single code base.<br/><br/> Inkline is written and maintained by <a href="https://github.com/alexgrozav">@alexgrozav</a>. 
    <br/>
    <br/>
    <a href="https://inkline.io">Homepage</a>
    ·
    <a href="https://inkline.io/docs/introduction">Documentation</a>
    ·
    <a href="https://storybook.inkline.io/">Storybook</a>
    ·
    <a href="https://stackblitz.com/edit/inkline?file=src/App.vue">Playground</a>
    ·
    <a href="https://github.com/inkline/inkline/issues">Issue Tracker</a>
</p>

<br/>

<p align="center">
    <a href="https://www.npmjs.com/package/@inkline/paper">
        <img src="https://img.shields.io/npm/v/@inkline/paper.svg" alt="npm version">
    </a>
    <a href="https://github.com/inkline/inkline/actions">
        <img src="https://github.com/inkline/paper/workflows/Build/badge.svg" alt="Build">
    </a>
    <a href="https://www.npmjs.com/package/@inkline/inkline">
        <img src="https://img.shields.io/npm/dm/@inkline/inkline.svg" alt="Downloads">
    </a>
    <a href="https://chat.inkline.io">
        <img src="https://img.shields.io/discord/550436704482492429.svg" alt="Discord">
    </a>
</p>


<br/>
<br/>

## Running locally

1. First, install dependencies using `npm install`.
2. From the root directory, run `npm run test` in the command line.

## Setup

Set an alias in your build system to resolve `@inkline/paper` to either `@inkline/paper/vue` or `@inkline/paper/react`. 

- `@inkline/paper` => `@inkline/paper/vue`
- `@inkline/paper` => `@inkline/paper/react`

Import the common component definition interface from `@inkline/paper` and decide whether you're creating a library for `vue` or `react` at build time.

## Usage

### Render function
#### `h(type: string, props: Record<string, any>, children: (VNode | string)[]): VNode`

The hoist function `h()` is used to create elements.

~~~ts
import { h } from '@inkline/paper';

const type = 'button';
const props = { id: 'button' };
const children = ['Hello world'];

const node = h(type, props, children);
~~~

### Define component
#### `defineComponent<Props, State>(definition: ComponentDefinition<Props, State>)`

The `defineComponent()` function is used to set up framework-specific internals and get type annotations. 

~~~ts
import { defineComponent, h } from '@inkline/paper';

const Component = defineComponent({
    render () {
        return h('div');
    }
});
~~~

**Vue.js**
~~~html
<component />
~~~

**React.js**
~~~tsx
<Component />
~~~

### Component render function
#### `defineComponent({ render(state: Props & State, ctx: RenderContext): VNode })`

The `render()` function is mandatory and is used to return the component markup using hoisting. 

~~~ts
import { defineComponent, h } from '@inkline/paper';

const Component = defineComponent({
    render () {
        return h('button', {}, [
            'Hello world'
        ]);
    }
});
~~~

**Vue.js**
~~~html
<component />
~~~

**React.js**
~~~tsx
<Component />
~~~

### Component setup function
#### `defineComponent({ setup(props: Props, ctx: SetupContext) })`

The `setup()` function is used to prepare functions.

~~~ts
import { defineComponent, h } from '@inkline/paper';

const Component = defineComponent<{}, { text: string }>({
    setup () {
        return {
            text: "Hello world"
        };
    },
    render (state) {
        return h('button', {}, [
            state.text
        ]);
    }
});
~~~

**Vue.js**
~~~html
<component />
~~~

**React.js**
~~~tsx
<Component />
~~~

#### Reference variables
##### `ref<Type>(defaultValue: Type)`

The `ref` variable works similar to the Vue.js `ref`. To access or set the value of a reference variable, access or manipulate its `value` field directly.

~~~ts
import { defineComponent, ref, h, Ref } from '@inkline/paper';

const Component = defineComponent<{}, { text: Ref<string>, onClick: () => void }>({
    setup () {
        const text = ref('Hello world');
        
        const onClick = () => {
            text.value = 'Bye world';
        }
        
        return {
            text,
            onClick
        };
    },
    render (state) {
        return h('button', { onClick: state.onClick }, [
            state.text.value
        ]);
    }
});
~~~

**Vue.js**
~~~html
<component />
~~~

**React.js**
~~~tsx
<Component />
~~~

#### Computed variables
##### `computed<Type>(() => Type)`

~~~ts
import { defineComponent, ref, h, Ref } from '@inkline/paper';

const Component = defineComponent<{ value: number; }, { double: Ref<number> }>({
    setup (props) {
        const double = computed(() => props.value * 2);
        
        return {
            double
        };
    },
    render (state) {
        return h('button', {}, [
            state.double.value
        ]);
    }
});
~~~

**Vue.js**
~~~html
<component />
~~~

**React.js**
~~~tsx
<Component />
~~~

#### Provide and Inject
##### `provide<Type>(identifier: string, value: Type)` 
##### `inject<Type>(identifier: string, defaultValue?: Type): Type`

~~~ts
import { defineComponent, ref, h, Ref } from '@inkline/paper';

const identifier = Symbol('identifier');

const Provider = defineComponent<{}, {}>({
    setup (props, ctx) {
        ctx.provide(identifier, 'value');
        
        return {};
    },
    render (state, ctx) {
        return h('div', {}, [
            ctx.slot()
        ]);
    }
});

const Consumer = defineComponent<{}, { value?: string; }>({
    setup (props, ctx) {
        const value = inject(identifier, 'defaultValue');
        
        return { value };
    },
    render (state, ctx) {
        return h('div', {}, [
            `${state.value}`
        ]);
    }
});
~~~

**Vue.js**
~~~html
<provider>
    <consumer />
</provider>
~~~

**React.js**
~~~tsx
<Provider>
    <Consumer />
</Provider>
~~~

### Component props
#### `defineComponent({ props: ComponentProps<Props> })`

Define the props using the `props` field, using the same format used in Vue.js. 

The `setup()` function receives the defined prop values with default as fallback.

~~~ts
import { defineComponent, h } from '@inkline/paper';

const Component = defineComponent<{ text: string }, {}>({
    props: {
        text: {
            type: String,
            default: () => 'Hello world'
        }
    },
    render (state) {
        return h('button', {}, [
            state.text
        ]);
    }
});
~~~

**Vue.js**
~~~html
<component text="Button" />
~~~

**React.js**
~~~tsx
<Component text={"Button"} />
~~~

### Component slots
#### `defineComponent({ slots: string[] })` and `renderContext.slot(slotName)`

The `slots` array allows you to define multiple slot names for the component. Out of the box, the `default` slot is pre-defined. 

The `slot()` function is available in the render function execution context.

~~~ts
import { defineComponent, h } from '@inkline/paper';

const Component = defineComponent({
    slots: ['header', 'footer'],
    render (state, ctx) {
        return h('div', { class: 'card' }, [
            ctx.slot('header'),
            ctx.slot(), // Default slot
            ctx.slot('footer'),
        ]);
    }
});
~~~

**Vue.js**
~~~html
<component>
    <template #header>Header</template>
    Body
    <template #footer>Header</template>
</component>
~~~

**React.js**
~~~tsx
<Component>
    <Component.Header>Header</Component.Header>
    Body
    <Component.Footer>Header</Component.Footer>
</Component>
~~~

### Component events
#### `defineComponent({ emits: string[] })` and `setupContext.emit(eventName, ...args)`

The `emits` array allows you to define event emitters. 

- for Vue.js, this uses the native `emit()` function
- for React.js, this creates an `on[EventName]` callback

~~~ts
import { defineComponent, h } from '@inkline/paper';

const Component = defineComponent<{}, { emitChange: () => void }>({
    emits: ['change'],
    setup (props, ctx) {
        const emitChange = () => {
            ctx.emit('change');
        } 
        
        return { emitChange };
    },
    render (state, ctx) {
        return h('button', { onClick: state.emitChange }, [ctx.slot()]);
    }
});
~~~

**Vue.js**
~~~html
<component @change="doSomething" />
~~~

**React.js**
~~~tsx
<Component onChange={() => doSomething()} />
~~~ 


## Creator
**Alex Grozav**

- <https://grozav.com>
- <https://twitter.com/alexgrozav>
- <https://facebook.com/alexgrozav>
- <https://github.com/alexgrozav>

If you use Inkline in your daily work and feel that it has made your life easier, please consider sponsoring me on [Github Sponsors](https://github.com/sponsors/alexgrozav). 💖

## Copyright and license
Homepage and documentation copyright 2017-2022 [Inkline Authors](https://github.com/inkline/inkline.io/graphs/contributors).
Docs released under [ISC License](https://github.com/inkline/inkline/blob/master/packages/docs/LICENSE).
