const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function getJSON(url, errorMsg = 'Something went wrong') {
    return fetch(url).then(response => {
        if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
        return response.json();
  });
}

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
    countriesContainer.style.opacity = 1;
}

function renderError(msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
}

async function whereAmI(country) {
    try {
      const pos = await getPosition();
      const { latitude: lat, longitude: lng } = pos.coords;

      const resGeo = await fetch(
        `https://geocode.xyz/${lat},${lng}?geoit=json`
      );
      if (!resGeo.ok) throw new Error("Problem getting location data!!!")
      const dataGeo = await resGeo.json();
      console.log(dataGeo);
      const res = await fetch(
        `https://restcountries.eu/rest/v2/name/${dataGeo.country}`
      );
      if (!res.ok) throw new Error('Problem getting country!!!');
      const data = await res.json();
      renderCountry(data[0]);
      // the same as doing:
      //   fetch(`https://restcountries.eu/rest/v2/name/${country}`)
      //     .then(res => console.log(res))
      return `You are in ${dataGeo.city},${dataGeo.country}`
    } catch(err) {
        console.error(`${err}`);
        renderError(`${err.message}`);
        //reject promise returned from async function
        throw err;
    }
}

(async function() {
    try {
        const city = await whereAmI();
        console.log(`2: ${city}`)
    } catch (err) {
        console.log(`2: ${err.message}`);
    }
    console.log('3: Finished');
})();

async function get3Countries(c1, c2, c3, c4) {
    try {
        // const [data1] = await getJSON(
        // `https://restcountries.eu/rest/v2/name/${c1}`
        // );
        // const [data2] = await getJSON(
        // `https://restcountries.eu/rest/v2/name/${c2}`
        // );
        // const [data3] = await getJSON(
        // `https://restcountries.eu/rest/v2/name/${c3}`
        // );
        // console.log([data1.capital, data2.capital, data3.capital]);

        const data = await Promise.all([

          getJSON(`https://restcountries.eu/rest/v2/name/${c1}`),
          getJSON(`https://restcountries.eu/rest/v2/name/${c2}`),
          getJSON(`https://restcountries.eu/rest/v2/name/${c3}`),
          getJSON(`https://restcountries.eu/rest/v2/name/${c4}`)
        ]);
          console.log(data.map(d => d[0].capital));
    } catch (error) {
        console.error(error);
    }
}
get3Countries('ireland', 'usa', 'spain', 'tajikistan')