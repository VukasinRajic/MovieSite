const BASE_URL = `https://image.tmdb.org/t/p/w500`;
const API_KEY = `api_key=f59a34ca53e5354324512b0d7afe9108`;
const PERSONS_POPULAR_URL = `https://api.themoviedb.org/3/person/popular?${API_KEY}`;
let sectionPic = document.querySelector(".section-pic");
let bio = document.querySelector(".bio");
let fullName = document.querySelector(".name");
let job = document.querySelector(".job");
let popularity = document.querySelector(".popularity");
const storedData = JSON.parse(localStorage.getItem("actorID"));
let onActorName = `https://api.themoviedb.org/3/search/person?api_key=f59a34ca53e5354324512b0d7afe9108&query=`;
let url = `https://api.themoviedb.org/3/person/${storedData}?${API_KEY}`;
let main = document.querySelector(".films");
const IMG_URL = `https://image.tmdb.org/t/p/w500`;
let NAME = "";

function getPersonMore(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      fullName.textContent = data.name;
      NAME = data.name;
      job.textContent = data.known_for_department;
      popularity.innerHTML = `<p>${Math.round(data.popularity)}</p>`;
      let textbig = data.biography;
      let separeted = textbig.split("\n\n");
      separeted.forEach((text) => {
        bio.innerHTML += `<p class="bio-part">${text}</p>`;
      });
      sectionPic.innerHTML = `<img src=${
        BASE_URL + data.profile_path
      } class="actor-img">`;

      getPerson(onActorName + NAME);
    });
}
function getPerson(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      getMore(data.results);
    });
}
getPersonMore(url);

function getMore(data) {
  data.forEach((rez) => {
    showMovies(rez.known_for);
  });
}

function showMovies(data) {
  main.innerHTML = "";
  data.forEach((movie) => {
    const { title, poster_path, id } = movie;
    if (poster_path) {
      const movieEl = document.createElement("div");
      movieEl.classList.add("movie");
      movieEl.innerHTML = `
        <img src="${
          IMG_URL + poster_path
        }" alt="${title}" class="movie-img" id="${id}">
        
      `;
      main.appendChild(movieEl);
      if (movie.first_air_date) {
        movieEl.addEventListener("click", goIntoTV);
      } else {
        movieEl.addEventListener("click", goIntoMovie);
      }

      const imgElement = movieEl.querySelector(".movie-img");
      imgElement.addEventListener("mouseover", () => {
        imgElement.style.transitionDuration = "0.6s";
      });

      imgElement.addEventListener("mouseout", () => {
        imgElement.style.transitionDuration = "0.6s";
      });
    }
  });
}
function goIntoMovie(e) {
  let id = e.target.getAttribute("id");
  const values = {
    number: id,
  };
  localStorage.setItem("id", JSON.stringify(values));
  window.location.assign("movie.html");
}
function goIntoTV(e) {
  let id = e.target.getAttribute("id");
  let otherValue = "1";
  const values = {
    number: id,
    otherValue: otherValue,
  };
  localStorage.setItem("id", JSON.stringify(values));
  window.location.assign("movie.html");
}
