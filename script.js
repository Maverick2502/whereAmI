'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
// function getCountryData(country) {
    
// const request = new XMLHttpRequest();
//     request.open('GET', 
//     `https://restcountries.eu/rest/v2/name/${country}`);
//     request.send();
//     console.log(request.responseText);

// request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText)
//     console.log(data);

//     const html = `
//     <article class="country">
//         <img class="country__img" src="${data.flag}" />
//         <div class="country__data">
//         <h3 class="country__name">${data.name}</h3>
//         <h4 class="country__region">${data.region}</h4>
//         <p class="country__row"><span>👫</span>${(
//           +data.population / 1000000
//         ).toFixed(1)} people</p>
//         <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
//         <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
//         </div>
//     </article>
//     `;

//     countriesContainer.insertAdjacentHTML('beforeend', html);
    // countriesContainer.style.opacity = 1;
//   });
// }

// getCountryData('tajikistan');
// getCountryData('ireland');
// getCountryData('usa');
// getCountryData('australia');

function renderCountry(data, className = '') {
  const text = `
    <article class="country ${className}">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)} million</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
        </div>
    </article>
    `;

  countriesContainer.insertAdjacentHTML('beforeend', text);
//   countriesContainer.style.opacity = 1;
}

// function getCountryAndNeighbor(country) {
// // AJAX call#1
//     const request = new XMLHttpRequest();
//         request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
//         request.send();

//     //Callback Trap
//     request.addEventListener('load', function () {
//         const [data] = JSON.parse(request.responseText);
//             console.log(data);
//             renderCountry(data)

//             //Get neighbor country#2
//         const [neighbor] = data.borders;
//             if (!neighbor) return;
//         const request2 = new XMLHttpRequest();
//             request2.open('GET', 
//             `https://restcountries.eu/rest/v2/alpha/${neighbor}`);
//             request2.send();  

//             request2.addEventListener('load', function () {
//         const data2 = JSON.parse(this.responseText);
//             renderCountry(data2, 'neighbor');
//     })
//  })
// }

// getCountryAndNeighbor('usa');

//Render ERROR!!!
function renderError(msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
    countriesContainer.style.opacity = 1;
}

function getJSON(url, errorMsg = 'Something went wrong') {
  return fetch(url)
    .then(response => {
        if (!response.ok)
        throw new Error(`${errorMsg} (${response.status})`);
  return response.json();
    });
}

//Promise
function getCountryData(country) {
    //Country#1
    getJSON(`https://restcountries.eu/rest/v2/name/${country}`, 'Country not found')
      .then(data => {
        renderCountry(data[0]);
        const neighbor = data[0].borders[0];

        if (!neighbor) throw new Error('No neighbor found ( ');
        //Country#2
        return getJSON(
          `https://restcountries.eu/rest/v2/alpha/${neighbor}`,
          'Country not found'
        );
      })
      .then(data => renderCountry(data, 'neighbor'))
      .catch(err => {
        console.log(`${err}🌋🌋`);
        renderError(`Something went wrong...${err.message}`);
      })
      .finally(() => {
        countriesContainer.style.opacity = 1;
      });
}
btn.addEventListener('click', function () {
    getCountryData(`cote d'ivoire`);
})

