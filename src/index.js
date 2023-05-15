import './css/styles.css';
import debounce from 'lodash.debounce';
import REFS from './js/references';
import { onUserInput } from './js/functions';

const DEBOUNCE_DELAY = 300;
const debouncedOnUserInput = debounce(onUserInput, DEBOUNCE_DELAY);

REFS.input_element.addEventListener('input', event => {
  const userInput = event.currentTarget.value.trim();
  debouncedOnUserInput(userInput);
});
