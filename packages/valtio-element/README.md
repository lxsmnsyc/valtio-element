# valtio-element

> Create reactive, declarative custom elements with `valtio`

[![NPM](https://img.shields.io/npm/v/valtio-element.svg)](https://www.npmjs.com/package/valtio-element) [![JavaScript Style Guide](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript) [![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox)](https://codesandbox.io/s/github/lxsmnsyc/valtio-element/tree/main/examples/valtio-element)

## Install

```bash
npm install --save valtio valtio-element
```

```bash
yarn add valtio valtio-element
```

## Usage

### Element definition

```ts
// For handling element state
import { proxy } from 'valtio/vanilla';
// For element lifecycle
import { watch } from 'valtio/utils';
// For element definition
import { define, setRenderer } from 'valtio-element';
// For element rendering
// You can use any renderer or VDOM libraries
import { html, render } from 'lit-html';

// Define our renderer
setRenderer((root, result) => {
  render(result, root);
});

define({
  // Custom element name
  name: 'counter-button',

  // Define props to track for.
  // This is an array of prop names.
  props: [],

  // This setup is only called once.
  // All watch lifecycles inside setup are automatically managed.
  setup() {
    const count = proxy({ value: 0 });

    function increment() {
      count.value += 1;
    }

    watch((get) => {
      console.log('Current count:', get(count).value);
    });

    return (get) => (
      // This re-renders for every tracked updates
      // In this case, it re-renders when count updates.
      html`
        <button @click=${increment}>Count: ${get(count).value}</button>
      `
    );
  },
});
```

```html
<counter-button></counter-button>
```

## Features

### Setup and Render

Inspired by Vue's Composition API, `valtio-element` has elements with `setup` definition, which defines the element's logic and the render method.

`setup` is only called once everytime the element gets connected (see `customElements` `connectedCallback`), and constructs the element's logic. The `setup` then must return a `render` callback which instructs the element how to render to its Shadow DOM.

```ts
define({
  name: 'my-element',
  setup() {
    // element logic
    return () => (
      // render
    );
  }
});
```

`render` receives a `get` callback which is used to track proxy updates and prompts the element to re-render its content.

### Props

`valtio-element` uses the element's `props` definition for tracking element attributes. You can then access these props with `setup`. The `props` object received is wrapped with `valtio/vanilla`'s `proxy` therefore they are reactive.

```ts
define({
  props: ['name'],
  setup(props) {
    watch((get) => {
      console.log('Name:', get(props).name);
    });
  },
});
```

### Element State

`valtio-element` can use `valtio/vanilla`'s `proxy` to construct element states.

### Lifecycles

`valtio-element` utilizes `valtio/utils`'s `watch` to handle element lifecycles and side-effects.

```ts
define({
  setup() {
    watch(() => {
      console.log('Mounted');
      return () => {
        console.log('Unmounted');
      };
    });
  },
});
```

You don't have to worry about managing `watch` lifecycles, they are automatically tracked and cleaned-up when necessary.

`valtio-element` also provides `onConnected`, `onAdopted` and `onDisconnected` hooks for handling custom element callbacks.

### Functional Declaration

`define` not just allows objects as element definition but also just plain functions.

```ts
define(function CounterButton() {
  const count = proxy({ value: 0 });

  function increment() {
    count.value += 1;
  }

  watch((get) => {
    console.log('Current count:', get(count).value);
  });

  return (get) => (
    // This re-renders for every tracked updates
    // In this case, it re-renders when count updates.
    html`
      <button @click=${increment}>Count: ${get(count).value}</button>
    `
  );
});
```

Element names are automatically transformed into kebab-case. However, this does not allow explicit prop definitions.

### Custom Renderer

The example above utilizes `lit-html` for rendering the DOM content of the element. You can use any kind of renderer (e.g. `react` and `react-dom`, `vue`, `uhtml`, etc.) and then define them once with `setRenderer`.

```tsx
import { define, setRenderer } from 'valtio-element';
import React from 'react';
import { render } from 'react-dom';

setRenderer((root, result) => {
  render(result, root);
});

define({
  setup() {
    return () => (
      <h1>Hello World</h1>
    );
  },
});
```

## License

MIT © [lxsmnsyc](https://github.com/lxsmnsyc)
