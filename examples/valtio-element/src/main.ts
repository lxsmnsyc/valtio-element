import { proxy } from 'valtio/vanilla';
import { watch } from 'valtio/utils';
import { setRenderer, define } from 'valtio-element';
import { render, html } from 'lit-html';

setRenderer((root, result) => {
  render(result, root);
});

define({
  name: 'counter-title',
  props: ['value'],
  setup(props) {
    watch((get) => {
      console.log(`Current count: ${get(props).value}`);
    });

    return (get) => (
      html`
        <h1>Count: ${get(props).value}</h1>
      `
    );
  },
});

define({
  name: 'counter-button',
  setup() {
    const count = proxy({ value: 1 });

    function increment() {
      count.value += 1;
    }

    function decrement() {
      count.value -= 1;
    }

    return (get) => (
      html`
        <button @click=${increment}>Increment</button>
        <button @click=${decrement}>Decrement</button>
        <counter-title value="${get(count).value}"></counter-title>
      `
    );
  },
});

define({
  name: 'custom-app',
  setup() {
    return () => (
      html`
        <counter-button></counter-button>
      `
    );
  },
});
