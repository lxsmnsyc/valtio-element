import { proxy } from 'valtio/vanilla';
import { watch } from 'valtio/utils';
import { setRenderer, define } from 'valtio-element';
import { render, html } from 'lit-html';

setRenderer((root, result) => {
  render(result, root);
});

define({
  name: 'greeting-text',
  props: ['greeting', 'person'],
  setup(props) {
    return (get) => (
      html`<h1>${get(props).greeting}, ${get(props).person}</h1>`
    );
  },
});

define({
  name: 'greeting-form',
  setup() {
    const greeting = proxy({ value: 'Hello' });
    const person = proxy({ value: 'Valtio' });

    watch((get) => {
      console.log('Greeting', get(greeting).value);
    });
    watch((get) => {
      console.log('Person', get(person).value);
    });

    function updateGreeting(event: Event) {
      greeting.value = event.target.value;
    }

    function updatePerson(event: Event) {
      person.value = event.target.value;
    }

    return (get) => (
      html`
        <input type="text" value=${get(greeting).value} @input=${updateGreeting} />
        <input type="text" value=${get(person).value} @input=${updatePerson} />
        <greeting-text greeting=${get(greeting).value} person=${get(person).value}></greeting-text>
      `
    );
  },
});

define({
  name: 'custom-app',
  setup() {
    return () => (
      html`
        <greeting-form></greeting-form>
      `
    );
  },
});
