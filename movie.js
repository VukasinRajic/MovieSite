const API_KEY = `api_key=f59a34ca53e5354324512b0d7afe9108`;
const IMG_URL = `https://image.tmdb.org/t/p/w500`;
const storedData = JSON.parse(localStorage.getItem("id"));
const MOVIE_DATA_FROM_ID = `https://api.themoviedb.org/3/movie/${storedData.number}?${API_KEY}`;
const TV_DATA_FROM_ID = `https://api.themoviedb.org/3/tv/${storedData.number}?${API_KEY}`;
const URL_GANRE_MOVIE = `https://api.themoviedb.org/3/discover/movie?${API_KEY}&with_genres=`;
const URL_GANRE_TV = `https://api.themoviedb.org/3/discover/tv?${API_KEY}&with_genres=`;
const backgroundWallpaper = document.getElementById("main-pic");
const movieDesc = document.getElementById("desc");
let gallery = document.getElementById("gallery");
let bookmarkbtn = document.querySelector(".bookmarkBTN");
let bookmarkIcon = bookmarkbtn.querySelector(".fa-bookmark");
let whatAcc = localStorage.getItem("acc");
let movieAccBookmark = `bookmarksMovie${whatAcc}`;
let tvAccBookmark = `bookmarksTV${whatAcc}`;

if (storedData.otherValue) {
  getTVData(TV_DATA_FROM_ID);
  let tvAccBookmarked = JSON.parse(localStorage.getItem(`${tvAccBookmark}`));

  if (tvAccBookmarked.includes(storedData.number)) {
    bookmarkIcon.classList.remove("fa-regular");
    bookmarkIcon.classList.add("fa-solid");
  }
} else {
  getMovieData(MOVIE_DATA_FROM_ID);
  let movieAccBookmarked = JSON.parse(
    localStorage.getItem(`${movieAccBookmark}`)
  );
  if (movieAccBookmarked.includes(storedData.number)) {
    bookmarkIcon.classList.remove("fa-regular");
    bookmarkIcon.classList.add("fa-solid");
  }
}

function getMovieData(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let {
        backdrop_path,
        original_title,
        budget,
        overview,
        vote_average,
        release_date,
        runtime,
        genres,
      } = data;

      if (original_title.length > 28) {
        printingTitle(backdrop_path, original_title, "smaller-text");
      } else if (original_title.length >= 18) {
        printingTitle(backdrop_path, original_title, "mid-text");
      } else {
        printingTitle(backdrop_path, original_title);
      }

      printingInfoMovie(overview, vote_average, budget, release_date, runtime);
      getMoviesSimilar(`${URL_GANRE_MOVIE}+${genres[0].id}`, 0);
    });
}
function getTVData(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let {
        backdrop_path,
        original_name,
        number_of_seasons,
        overview,
        vote_average,
        first_air_date,
        episode_run_time,
        genres,
      } = data;

      if (original_name.length > 28) {
        printingTitle(backdrop_path, original_name, "smaller-text");
      } else if (original_name.length >= 18) {
        printingTitle(backdrop_path, original_name, "mid-text");
      } else {
        printingTitle(backdrop_path, original_name);
      }

      printingInfoTV(
        overview,
        vote_average,
        number_of_seasons,
        first_air_date,
        episode_run_time
      );
      getMoviesSimilar(`${URL_GANRE_TV}+${genres[0].id}`, 1);
    });
}
// --------------------------------------------------------------------
function printingTitle(backdrop_path, original_title, sizeClass = "") {
  backgroundWallpaper.innerHTML = `<img src="${
    IMG_URL + backdrop_path
  }" class="movieBackground " >
  <div class="overlay" id="overlay"></div>
    <p class="movie-title ${sizeClass}">${original_title}</p>`;
}
// printing info and its helpers functions-----------------------------
function printingInfoMovie(
  overview,
  vote_average,
  budget,
  release_date,
  runtime
) {
  let vote = calcVoteColor(vote_average);
  let overviewSized = calcOverviewSize(overview);

  if (budget == 0) {
    budget = "X";
  } else {
    budget = budget / 1000000;
  }
  if (budget !== "X") {
    budget = Math.round(budget);
  }
  movieDesc.innerHTML = `
    ${vote}
    <p class="budget">${budget} milion $<br> Budget</p>
    <p class="date-time"> ${release_date}<br> Release date</p>
    <p class="date-time">${runtime} min <br> Runtime</p>
    ${overviewSized}`;
}
function printingInfoTV(
  overview,
  vote_average,
  number_of_seasons,
  first_air_date,
  episode_run_time
) {
  let vote = calcVoteColor(vote_average);
  let overviewSized = calcOverviewSize(overview);
  let avgEpTime = ``;

  if (episode_run_time.length > 1) {
    avgEpTime = `${episode_run_time[0]} - ${episode_run_time[1]}`;
  } else if ((episode_run_time = 1)) {
    avgEpTime = `X`;
  } else {
    avgEpTime = episode_run_time;
  }

  movieDesc.innerHTML = `
  ${vote}
  <p class="date-time">${number_of_seasons}<br> Seasons </p>
  <p class="date-time"> ${first_air_date}<br> First air date</p>
  <p class="date-time">${avgEpTime} min <br> Runtime</p>
  ${overviewSized}`;
}
function calcVoteColor(vote_average) {
  let vote = "";
  if (vote_average < 4.1) {
    vote = `<p class="vote_average red">${vote_average.toFixed(1)}</p>`;
  } else if (vote_average < 7.2) {
    vote = `<p class="vote_average orange">${vote_average.toFixed(1)}</p>`;
  } else {
    vote = `<p class="vote_average ">${vote_average.toFixed(1)}</p>`;
  }
  return vote;
}
function calcOverviewSize(overview) {
  if (overview.length == 0) {
    overview = "There is no overview for this TV Show/ Movie.";
  }
  let overviewSized = "";
  if (overview.length > 500) {
    overviewSized = `<p class="overview overview-big">${overview}</p>`;
  } else if (overview.length > 285) {
    overviewSized = `<p class="overview overview-medium">${overview}</p>`;
  } else {
    overviewSized = `<p class="overview ">${overview}</p> `;
  }
  return overviewSized;
}
// --------------------------------------------------------------------

// geting Movies/Tv with the same ganre and printing it ---------------
function getMoviesSimilar(url, id) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showMoviesSimilar(data.results, id);
    });
}
function showMoviesSimilar(data, idd) {
  data.forEach((movie) => {
    const { title, poster_path, id } = movie;
    if (poster_path) {
      let accId = parseInt(storedData.number);

      if (id !== accId) {
        let movieEl = document.createElement("div");
        movieEl.classList.add("slide");
        movieEl.innerHTML = `
        <img src="${
          IMG_URL + poster_path
        }" alt="${title}" class="slide-img " id="${id}">
        
        `;
        if (idd == 1) {
          movieEl.addEventListener("click", goIntoTV);
        } else {
          movieEl.addEventListener("click", goIntoMovie);
        }
        const imgElement = movieEl.querySelector(".slide-img");
        imgElement.addEventListener("mouseover", () => {
          imgElement.style.transitionDuration = "0.6s";
        });

        imgElement.addEventListener("mouseout", () => {
          imgElement.style.transitionDuration = "0.6s";
        });
        gallery.appendChild(movieEl);
      }
    }

    slider();
  });
}

const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");

  let curSlide = 0;
  const maxSlide = slides.length;

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${150 * (i - slide + 0.3)}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 4) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 4;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
  };

  const init = function () {
    goToSlide(0);
  };
  init();

  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });
};
// --------------------------------------------------------------------
function goIntoMovie(e) {
  let id = e.target.closest(".slide-img").getAttribute("id");
  const values = {
    number: id,
  };
  localStorage.setItem("id", JSON.stringify(values));
  window.location.assign("movie.html");
}
function goIntoTV(e) {
  let id = e.target.closest(".slide-img").getAttribute("id");
  let otherValue = "1";
  const values = {
    number: id,
    otherValue: otherValue,
  };
  localStorage.setItem("id", JSON.stringify(values));
  window.location.assign("movie.html");
}
// --------------------------bookmarking
bookmarkbtn.addEventListener("click", function () {
  const isRegular = bookmarkIcon.classList.contains("fa-regular");
  const storageKey = storedData.otherValue ? tvAccBookmark : movieAccBookmark;
  const bookmarks = JSON.parse(localStorage.getItem(storageKey)) || [];
  const movieId = storedData.number;

  if (isRegular) {
    bookmarkIcon.classList.remove("fa-regular");
    bookmarkIcon.classList.add("fa-solid");

    if (!bookmarks.includes(movieId)) {
      bookmarks.push(movieId);
      localStorage.setItem(storageKey, JSON.stringify(bookmarks));
    }
  } else {
    bookmarkIcon.classList.add("fa-regular");
    bookmarkIcon.classList.remove("fa-solid");

    if (bookmarks.includes(movieId)) {
      const index = bookmarks.indexOf(movieId);
      bookmarks.splice(index, 1);
      localStorage.setItem(storageKey, JSON.stringify(bookmarks));
    }
  }
});
