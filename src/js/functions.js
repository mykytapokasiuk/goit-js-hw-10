import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import REFS from './references.js';
import { fetchCountries } from './fetchCountries.js';

/**
 * Processes the server response, adds markup to the DOM
 * @function onUserInput
 * @param {string} name
 */
const onUserInput = name => {
  if (!name) {
    REFS.country_info.innerHTML = '';
    REFS.country_list.innerHTML = '';
    return;
  } else
    fetchCountries(name)
      .then(result => {
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
  REFS.country_list.innerHTML = '';
  REFS.country_info.innerHTML = '';
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
 * Produces different markup depending on the server's response
 * @function createMarkup
 * @param {array} serverResponse Array of objects
 * @param {element} element Object
 */
function createMarkup(serverResponse, element) {
  const serverResponseLength = serverResponse.length,
    languagesValues = Object.values(element.languages).join(' ');
  if (serverResponseLength > 10) {
    REFS.country_list.innerHTML = '';
    REFS.country_info.innerHTML = '';
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
  } else if (serverResponseLength >= 2 && serverResponseLength <= 10) {
    REFS.country_info.innerHTML = '';
    return `
    <li class='li-item'>
    <img src='${element.flags.png}' alt='${element.flags.alt}' srcset='${element.flags.svg}' class="li-icon"></img>
    <p class='li-text'>${element.name.common}</p>
    </li>`;
  } else if (element.capital[0] === 'Moscow') {
    REFS.country_info.innerHTML = '';
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
  <h2 class='country-title'>${element.name.common}</h2>
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
 *  Updates markup
 * @function updateCountriesList
 * @param {string} markup
 */
function updateCountriesList(markup) {
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
  const url = 'https://war.ukraine.ua/russia-war-crimes/';
  window.open(url);
}
export { onUserInput };
