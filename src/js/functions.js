import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import REFS from './references.js';
import { fetchCountries } from './fetchCountries.js';

/**
 * Processes the server's response to user input
 * @function onUserInput
 * @param {string} name
 */
const onUserInput = name => {
  fetchCountries(name)
    .then(result => {
      return result.reduce(
        (markup, element) => handleServerResponse(result, element) + markup,
        ''
      );
    })
    .then(renderMarkup)
    .catch(error => onError(error));
};
/**
 * Reports an error
 * @function onError
 * @param {Error} error
 */
function onError(error) {
  REFS.country_list.innerHTML = '';
  REFS.country_info.innerHTML = '';
  if (error.message === '404') {
    Notify.failure('Oops, there is no country with that name.', {
      width: '260px',
      showOnlyTheLastOne: true,
      position: 'center-center',
      timeout: 2000,
      fontSize: '15px',
      borderRadius: '8px',
      cssAnimationStyle: 'from-top',
    });
  } else {
    Notify.failure(`${error.message}`, {
      width: '260px',
      showOnlyTheLastOne: true,
      position: 'center-center',
      timeout: 2000,
      fontSize: '15px',
      borderRadius: '8px',
      cssAnimationStyle: 'from-top',
    });
  }
}
/**
 * Passes processed information to functions depending on the server's response
 * @function handleServerResponse
 * @param {array} serverResponse Array of objects
 * @param {element} element Object
 */
function handleServerResponse(serverResponse, element) {
  const serverResponseLength = serverResponse.length;
  if (serverResponseLength > 10) {
    REFS.country_list.innerHTML = '';
    REFS.country_info.innerHTML = '';
    Notify.info('Too many matches found. Please enter a more specific name.', {
      width: '260px',
      showOnlyTheLastOne: true,
      position: 'center-center',
      timeout: 2000,
      fontSize: '15px',
      borderRadius: '8px',
      cssAnimationStyle: 'from-top',
    });
    return '';
  } else if (serverResponseLength >= 2 && serverResponseLength <= 10) {
    return createCountriesMarkup(element);
  } else {
    return createCountryMarkup(element);
  }
}
/**
 * Creates markup for multiple countries
 * @function createCountryMarkup
 * @param {object} element
 * @returns {string} String
 */
function createCountriesMarkup(element) {
  REFS.country_info.innerHTML = '';
  return `
    <li class='li-item'>
    <img src='${element.flags.png}' alt='${element.flags.alt}' srcset='${element.flags.svg}' class="li-icon"></img>
    <p class='li-text'>${element.name.common}</p>
    </li>`;
}
/**
 * Creates markup for one country
 * @function createCountryMarkup
 * @param {object} element
 * @returns {string} String
 */
function createCountryMarkup(element) {
  const languagesValues = Object.values(element.languages).join(', ');
  if (element.capital[0] === 'Moscow') {
    REFS.country_list.innerHTML = '';
    REFS.input_element.setAttribute('disabled', 'true');
    Report.failure(
      'This app does not show information about a terrorist country!',
      'Only its crimes...',
      'I agree',
      () => openUrl(),
      {
        svgSize: '80px',
        titleMaxLength: 100,
        messageFontSize: '20px',
      }
    );
    return '';
  } else if (element.capital[0] === 'Kyiv') {
    REFS.country_list.innerHTML = '';
    return `
    <img src='${element.flags.png}' alt='${element.flags.alt}' srcset='${element.flags.svg}' class="country-icon-ua"></img>
  <h2 class='country-title-ua'>${element.name.common}</h2>
      <ul class="country-info-list">
      <li class="country-info-list-item"><b>Capital:</b> ${element.capital}</li>
      <li class="country-info-list-item"><b>Population:</b> ${element.population}</li>
      <li class="country-info-list-item"><b>Languages:</b> ${languagesValues}</li>
    </ul>
    <p class='country-text-ua'>Glory to Ukraine!</p>
  `;
  } else {
    REFS.country_list.innerHTML = '';
    return `
    <div class='country-title-container'>
    <img src='${element.flags.png}' alt='${element.flags.alt}' srcset='${element.flags.svg}' class="country-icon"></img>
  <h2 class='country-title'>${element.name.common}</h2>
  </div>
      <ul class="country-info-list">
      <li class="country-info-list-item"><b>Capital:</b> ${element.capital}</li>
      <li class="country-info-list-item"><b>Population:</b> ${element.population}</li>
      <li class="country-info-list-item"><b>Languages:</b> ${languagesValues}</li>
    </ul>
  `;
  }
}

/**
 *  Renders markup
 * @function renderMarkup
 * @param {string} markup
 */
function renderMarkup(markup) {
  markup.includes('country-info-list')
    ? (REFS.country_info.innerHTML = markup)
    : (REFS.country_list.innerHTML = markup);
}
/**
 * Opens a new window
 * @function openUrl
 */
function openUrl() {
  REFS.input_element.value = '';
  REFS.input_element.removeAttribute('disabled');
  const url = 'https://war.ukraine.ua/russia-war-crimes/';
  window.open(url);
}
export { onUserInput };
