import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
    inputData: document.querySelector('input#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

const { inputData, countryList, countryInfo } = refs;

inputData.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));


function showError() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}

function makeList(countries) {
    const markup = countries.map(({ name, flags }) => {
        return `<li><img src="${flags.svg}" width="50"  alt="${name.common}"/> <span>${name.official}</span> </li>`;
    }).join('')
    countryList.innerHTML = markup;
    countryInfo.innerHTML = '';
}

function makeItem(countries) {
    const markupInfo = countries
        .map(({ name, flags, capital, population, languages }) => {
            return `<div><img src="${flags.svg}" width="60" alt="${name.common}"/>
                <h1>${name.official}</h1>
        <p> Capital: ${capital}</p>
        <p> Population: ${population}</p>
        <p> Languages: ${Object.values(languages)}</p>
        </div>`;
        })
        .join('');
    countryList.innerHTML = '';
    countryInfo.innerHTML = markupInfo;
}

function onSearch(e) {
    let onSearchInput = e.target.value.trim()
    if (onSearchInput === '') {
        showError()
        return;
    } else {
        return fetchCountries(onSearchInput)
            .then(countries => renderCountries(countries))
            .catch(error => {
                console.log(error);
                Notify.failure('Oops, there is no country with that name');
            });
    }
}
function renderCountries(countries) {
    if (countries.length > 10) {
        showError()
        Notify.info('Too many matches found. Please enter a more specific name.')
    }
    if (countries.length >= 2 && countries.length <= 10) {
        makeList(countries)
    }
    if (countries.length === 1) {
        makeItem(countries)
    }
}

