/**
 *  Gets array of objects from server
 * @function fetchCountries
 * @param {string} name
 * @returns {Promise}
 */
const fetchCountries = name => {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (response.ok) {
      return response.json();
    } else throw new Error(response.status);
  });
};

export { fetchCountries };
