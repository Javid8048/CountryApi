"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");
const imgContainer = document.querySelector(".images");

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
// map.callMap("palestine", "friendlyNeighbour");

const addToHtml = function (data, countryclass = "") {
  //   prettier-ignore
  countriesContainer.insertAdjacentHTML(
    "beforeend",
    `<article class="country ${countryclass}">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(+data.population / 10000000).toFixed(1)}M people</p>
        <p class="country__row"><span>🗣️</span>${Object.values(data.languages).toString().replace(",", ` ,`)}</p>
        <p class="country__row"><span>💰</span>${Object.keys(data.currencies).toString()}</p>
        </div>
    </article>`
  );
};

const getCountry = function (country) {
  let response = fetch(`https://restcountries.com/v3.1/name/${country}`);
  response
    .then((res) => {
      if (!res.ok) throw new Error("Country not found");
      return res.json();
    })
    .then((data) => {
      console.log(data);
      if (data.length == 1) addToHtml(data[0]);
      else addToHtml(data[1]);
      return fetch(
        `https://restcountries.com/v3.1/alpha/${data[1].borders?.[1]}`
      );
    })
    .then((res) => res.json())
    .then((data) => {
      addToHtml(data[0], "neighbour");
    })
    .catch((err) => {
      console.log(err);
      countriesContainer.insertAdjacentText("beforeend", `${err}`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
      btn.style.display = "none";
    });
};

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(5).then(() => console.log("logged after 5 seconds"));

btn.addEventListener("click", getCountry.bind(this, "China"));
btn.addEventListener("click", () => {
  let getAsyncReturn;
  navigator.geolocation.getCurrentPosition((location) => {
    const { latitude, longitude } = location.coords;
    this.getAsyncReturn = getCoords(latitude, longitude);
  });
  async function getCoords(lat, long) {
    const coords = await fetch(
      `https://geocode.xyz/${lat},${long}?geoit=json&auth=146561561769554918524x1967`
    );
    const data = await coords.json();
    console.log(data);
    getCountry.call(getCountry, data.country);
  }
});

(async function (c1, c2, c3) {
  const countryArr = await Promise.all([
    getCountry(c1),
    getCountry(c2),
    getCountry(c3),
  ]);
})("nepal", "china", "india");

// all, race, allSettled, any;
// Promise.any([
//   Promise.reject("error"),
//   Promise.reject("error"),
//   Promise.reject("error"),
//   Promise.resolve("success"),
//   Promise.resolve("success 1"),
// ]).then((res) => console.log(res));

const createImg = function (imgSrc) {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.addEventListener("load", () => {
      imgContainer.append(img);
      resolve(img);
    });

    img.addEventListener("error", (err) => {
      reject(new Error(err, "Image not found"));
    });
  });
};



const loadAll = function(...imgArr) {
  imgArr.forEach((imgs) => {
    let currentImage = wait(5).then(createImg(imgs))
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
  })
}

loadAll("/img/img-1.jpg", "/img/img-2.jpg", "/img/img-3.jpg")