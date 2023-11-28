'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const imgContainer = document.querySelector(".images")
///////////////////////////////////////

// class Map {
//     constructor() { }
//     callMap(country, countryclass='') {
//         const request = new XMLHttpRequest();
//         request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//         request.send();
//         request.addEventListener("load", function () {
//             const arr = country === "india" ? 1 :  0;
//             const data = JSON.parse(this.responseText)[arr];
//             console.log(data);
//            
//         })
//     }
// }

// const map = new Map();
// map.callMap("palestine", 'friendlyNeighbour')

const addToHtml = function (data, countryclass = "") {
    countriesContainer.insertAdjacentHTML("beforeend", `
                    <article class="country ${countryclass}">
                    <img class="country__img" src="${data.flags.png}" />
                    <div class="country__data">
                    <h3 class="country__name">${data.name.common}</h3>
                    <h4 class="country__region">${data.region}</h4>
                    <p class="country__row"><span>👫</span>${(+data.population / 10000000).toFixed(1)}M people</p>
                    <p class="country__row"><span>🗣️</span>${Object.values(data.languages).toString().replace(',', ` ,`)}</p>
                    <p class="country__row"><span>💰</span>${Object.keys(data.currencies).toString()}</p>
                    </div>
                </article>
        `);

}

const getCountry = function (country) {
    let response = fetch(`https://restcountries.com/v3.1/name/${country}`)
    response.then(res => {
        console.log(res);
        if (!res.ok) throw new Error("Country not found")
        return res.json()
    })
        .then(data => {
            console.log(data)
            addToHtml(data[1])
            return fetch(`https://restcountries.com/v3.1/alpha/${data[1].borders?.[1]}`)
        })
        .then(res => res.json())
        .then(data =>{
            console.log(data);
            addToHtml(data[0], "neighbour")
        })
        .catch(err => {
            console.log(err);
            countriesContainer.insertAdjacentText("beforeend", `${err}`);
        })
        .finally(() => {
            countriesContainer.style.opacity = 1;
            btn.style.display = "none";
        })
}

const wait = function (seconds) {
    return new Promise(function (resolve) {
      setTimeout(resolve, seconds * 1000);
    });
  };

wait(5).then(() => console.log("logged after 5 seconds"))

btn.addEventListener("click", getCountry.bind(this, "China"))

navigator.geolocation.getCurrentPosition(location => {
    const {latitude, longitude} = location.coords;
    getCoords(latitude, longitude);
})

const getCoords = async function(lat, long) {
    const coords = await fetch(`https://geocode.xyz/${lat},${long}?geoit=json`);
    const data = await coords.json()
    console.log(coords);
    console.log(data);
} 
getCoords();
console.log("test started async");

// const getImage = function(imgUrl) {
//     return new Promise(function(resolve, reject) {
        
//     })
// } 