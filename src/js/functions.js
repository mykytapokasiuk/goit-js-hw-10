import { Notify } from 'notiflix/build/notiflix-notify-aio';
import REFS from './references.js';
import { fetchCountries } from './fetchCountries.js';

/**
 ** 1. Get references to html elements
 * *2. Create function fetchCountries for http request
 ** 3. Use debounce on event listener
 ** 4. If user clears input http request wont work, markup removes from DOM
 ** 5. Add trim() to user input
 * 6. Create function that makes markup with result of fetchCountries
 ** 6.1 If server response has more than 10 results, alert "Too many matches found. Please enter a more specific name."
 * 6.2 If server response has 2-10 results - create markup with flags and name of a country
 * 6.3 If server response has 1 result - create markup with flag, name of a country, capital, population, currencies
 * 6.4 If country not exists - alert "Oops, there is no country with that name", (error 404)
 * /



/**
 * Processes the server response, adds markup to the DOM
 * @function onUserInput
 * @param {string} name
 */
const onUserInput = name => {
  if (!name) {
    return;
  } else
    fetchCountries(name)
      .then(result => {
        console.log(result);
        return result.reduce(
          (markup, element) => createMarkup(result, element) + markup,
          ''
        );
      })
      .then(updateCountriesList)
      .catch(errror => onError(errror));
};
/**
 * Reports an error
 * @function onError
 * @param {Error} error
 */
function onError(error) {
  Notify.failure('Oops, there is no country with that name.', {
    width: '260px',
    showOnlyTheLastOne: true,
    position: 'right-bottom',
    distance: '40px',
    timeout: 2000,
    fontSize: '15px',
    borderRadius: '8px',
    cssAnimationStyle: 'from-bottom',
  });
  console.error(error);
}
/**
 * Creates markup
 * @function createMarkup
 * @param {array} userInput array of objects
 */
function createMarkup(serverResponse, element) {
  const serverResponseLength = serverResponse.length;
  if (serverResponseLength > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.', {
      width: '260px',
      showOnlyTheLastOne: true,
      position: 'right-bottom',
      distance: '40px',
      timeout: 2000,
      fontSize: '15px',
      borderRadius: '8px',
      cssAnimationStyle: 'from-bottom',
    });
    return '';
  } else if (serverResponseLength >= 2 && serverResponseLength < 10) {
    return `<li>${element.capital}</li>`;
  } else return `<li>ONLY ONE!!!    ${element.capital}</li>`;
}

function updateCountriesList(markup) {
  REFS.country_list.innerHTML = markup;
}
export { onUserInput };
