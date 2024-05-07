const API_KEY = `api_key=f59a34ca53e5354324512b0d7afe9108`;
const BASE_URL = `https://api.themoviedb.org/3`;
const API_URL = BASE_URL + `/movie/upcoming?` + API_KEY;
const IMG_URL = `https://image.tmdb.org/t/p/w500`;
const TV_POPULAR_URL = BASE_URL + "/tv/popular?" + API_KEY;
const MOVIE_POPULAR_URL = BASE_URL + "/movie/popular?" + API_KEY;
const PERSONS_POPULAR_URL = `${BASE_URL}/person/popular?${API_KEY}`;
let searchURL = BASE_URL + "/search/movie?" + API_KEY;
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const searchContainer = document.getElementById("searchContainer");
const searchInput = searchContainer.querySelector(".search-input");
const homeBtn = document.getElementById("home-btn");
const seriesBtn = document.getElementById("series-btn");
const moviesBtn = document.getElementById("movies-btn");
const actorsBtn = document.getElementById("actors-btn");
const bookmarksBtn = document.getElementById("bookmarks-btn");
const settingsBtn = document.getElementById("settings-btn");
const bookmarksPage = document.querySelector(".bookmarks-page");
let mainUser = document.getElementById("main-user");

// loads the upcoming movies
getMovies(API_URL);

//creates acc bookmarks storage in LocalStorage for each acc
function createBookmarksforacc() {
  const accounts = ["acc1", "acc2", "acc3"];
  const types = ["Movie", "TV"];

  accounts.forEach((account) => {
    types.forEach((type) => {
      const key = `bookmarks${type}${account}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });
  });
}
createBookmarksforacc();

//if no acc is set (when u first get on the site) it sets the curent acc to acc1
let currentAcc = localStorage.getItem("acc");
if (!currentAcc) {
  localStorage.setItem("acc", "acc1");
}

//when the page is loaded the Main acc is set to show (color and name)
let accCurrent = localStorage.getItem(currentAcc);
if (accCurrent) {
  const name = accCurrent.split(",")[0];
  const color = accCurrent.split(",")[1];
  //removes color from the previous acc
  const userMain = mainUser.querySelector(".user-logo");
  userMain.classList.remove(
    ...Array.from(userMain.classList).filter(
      (className) => className !== "user-logo"
    )
  );
  //now that the main acc is cleared of color we set the color of the current acc
  if (color) {
    mainUser.querySelector(".user-logo").classList.add(`${color}`);
  }
  //here we set the name of the current acc
  mainUser.querySelector(".user-logo").firstChild.textContent =
    name[0].toUpperCase();
  mainUser.querySelector(".user-name").textContent =
    name[0].toUpperCase() + name.slice(1);
}

//here we change the html of accounts to match the color and name that was set and send to local storage for each acc
function setSettingsAccs() {
  const accounts = document.querySelector(".accounts");
  const accSettings = ["acc1", "acc2", "acc3"];

  accSettings.forEach((acc) => {
    let settings = localStorage.getItem(acc);
    if (settings) {
      let accElement = accounts.querySelector(`.${acc}`);
      let [name, color] = settings.split(",");

      let userLogo = accElement.querySelector(".user-logo");
      userLogo.classList.add(color);
      userLogo.innerHTML = `<p>${name[0].toUpperCase()}</p>`;

      let accName = accElement.querySelector(".acc-name");
      accName.textContent = name[0].toUpperCase() + name.slice(1);
    }
  });
}
setSettingsAccs();

//here we observe the mainUser so when we change acc in settings the class is sent to mainUser and we collect it here
//so we can configure the bookmarks to be filled only for the current acc
let config = { attributes: true, attributeFilter: ["class"] };
let callback = function (mutationsList, observer) {
  for (var mutation of mutationsList) {
    if (mutation.type === "attributes" && mutation.attributeName === "class") {
      movieAccBookmark = `bookmarksMovie${mainUser.classList[1]}`;
      tvAccBookmark = `bookmarksTV${mainUser.classList[1]}`;
      localStorage.setItem("acc", mainUser.classList[1]);
      break;
    }
  }
};
let movieAccBookmark = `bookmarksMovie${mainUser.classList[1]}`;
let tvAccBookmark = `bookmarksTV${mainUser.classList[1]}`;
let observer = new MutationObserver(callback);
observer.observe(mainUser, config);

function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showMovies(data.results);
    });
}
function getActors(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showActors(data.results);
    });
}
function getTV(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showTV(data.results);
    });
}
function getBookmarks() {
  bookmarksPage.innerHTML = "";
  const currentAcc = localStorage.getItem("acc");
  let bookmarksMovie = localStorage.getItem(`bookmarksMovie${currentAcc}`);
  let bookmarksTV = localStorage.getItem(`bookmarksTV${currentAcc}`);

  if (bookmarksMovie.length > 0 || bookmarksTV.length > 0) {
    let movies = JSON.parse(bookmarksMovie);
    let tv = JSON.parse(bookmarksTV);
    bookmarksPage.innerHTML = "";
    movies.forEach(function (movieid) {
      fetch(`https://api.themoviedb.org/3/movie/${movieid}?${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
          showMoviesBookmarked(data);
        });
    });
    tv.forEach(function (movieid) {
      fetch(`https://api.themoviedb.org/3/tv/${movieid}?${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
          showTVBookmarked(data);
        });
    });
  }
}

// ---------------------------------------------------------------------------

function showMoviesBookmarked(movie) {
  const { title, poster_path, id } = movie;
  if (poster_path) {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
      <img src="${
        IMG_URL + poster_path
      }" alt="${title}" class="movie-img" id="${id}">
      
    `;
    bookmarksPage.appendChild(movieEl);
    movieEl.addEventListener("click", goIntoMovie);
    movieEl.addEventListener("mouseover", () => {
      movieEl.style.transitionDuration = "0.6s";
    });

    movieEl.addEventListener("mouseout", () => {
      movieEl.style.transitionDuration = "0.6s";
    });
  }
}
function showTVBookmarked(movie) {
  const { title, poster_path, id } = movie;
  if (poster_path) {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
      <img src="${
        IMG_URL + poster_path
      }" alt="${title}" class="movie-img" id="${id}">
      
    `;
    bookmarksPage.appendChild(movieEl);
    movieEl.addEventListener("click", goIntoTV);
    movieEl.addEventListener("mouseover", () => {
      movieEl.style.transitionDuration = "0.6s";
    });

    movieEl.addEventListener("mouseout", () => {
      movieEl.style.transitionDuration = "0.6s";
    });
  }
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
      movieEl.addEventListener("click", goIntoMovie);
      movieEl.addEventListener("mouseover", () => {
        movieEl.style.transitionDuration = "0.6s";
      });

      movieEl.addEventListener("mouseout", () => {
        movieEl.style.transitionDuration = "0.6s";
      });
    }
  });
}
function showTV(data) {
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
      movieEl.addEventListener("click", goIntoTV);
      movieEl.addEventListener("mouseover", () => {
        movieEl.style.transitionDuration = "0.6s";
      });

      movieEl.addEventListener("mouseout", () => {
        movieEl.style.transitionDuration = "0.6s";
      });
    }
  });
}
function showActors(data) {
  main.innerHTML = ``;
  data.forEach((movie) => {
    const { name, profile_path, id } = movie;
    if (profile_path) {
      const movieEl = document.createElement("div");
      movieEl.classList.add("movie");
      movieEl.innerHTML = `
      <img src="${
        IMG_URL + profile_path
      }" alt="${name}" class="movie-img" id=${id}>
      
    `;
      movieEl.addEventListener("click", goIntoPerson);
      main.appendChild(movieEl);
      movieEl.addEventListener("mouseover", () => {
        movieEl.style.transitionDuration = "0.6s";
      });

      movieEl.addEventListener("mouseout", () => {
        movieEl.style.transitionDuration = "0.6s";
      });
    }
  });
}

// ---------------------------------------------------------------------------
function goIntoMovie(e) {
  let id = e.target.getAttribute("id");
  const values = {
    number: id,
  };
  let bookmarksMovie = localStorage.getItem(movieAccBookmark);
  if (!bookmarksMovie) {
    localStorage.setItem(movieAccBookmark, JSON.stringify([]));
  }

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
  let bookmarksTV = localStorage.getItem(tvAccBookmark);
  if (!bookmarksTV) {
    localStorage.setItem(tvAccBookmark, JSON.stringify([]));
  }
  localStorage.setItem("id", JSON.stringify(values));
  window.location.assign("movie.html");
}
function goIntoPerson(e) {
  let id = e.target.getAttribute("id");
  localStorage.setItem("actorID", JSON.stringify(id));
  window.location.assign("person.html");
}
// ---------------------------------------------------------------------------

// -------------------------------------------------------------- search bar event
searchContainer.addEventListener("keypress", function (e) {
  if (e.key == "Enter" || e.key == "Return") {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm) {
      if (searchURL.includes("tv?")) {
        getTV(searchURL + "&query=" + searchTerm);
      } else if (searchURL.includes("movie?")) {
        getMovies(searchURL + "&query=" + searchTerm);
      } else {
        getActors(searchURL + "&query=" + searchTerm);
      }

      searchInput.value = "";
    }
  }
});

searchContainer.addEventListener("click", function () {
  searchContainer.classList.add("active");
  searchInput.focus();
});

searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchContainer.classList.remove("active");
  }
});
// -------------------------------------------------------------- search bar event

// -------------------------------------------------------------- nav buttons events
const listOfBtns = [seriesBtn, moviesBtn, actorsBtn, bookmarksBtn, settingsBtn];
function toggleClassBtn(btn) {
  const buttons = [seriesBtn, moviesBtn, settingsBtn, actorsBtn, bookmarksBtn];

  // Add focus class to clicked button
  btn.classList.add("focus-btn");
  btn.classList.remove("off-focus-btn");

  // Remove focus class from other buttons
  buttons.forEach((otherBtn) => {
    if (otherBtn !== btn) {
      otherBtn.classList.remove("focus-btn");
      otherBtn.classList.add("off-focus-btn");
    }
  });
}
function switchPages(mainPage, settingsPage, bookmarksPage) {
  const sectionFilms = document.querySelector(".section-films");
  const settings = document.querySelector(".settings-page");
  const bookmarks = document.querySelector(".bookmarks-page");

  // Deactivate all pages
  [sectionFilms, settings, bookmarks].forEach((page) => {
    page.classList.remove("activate");
    page.classList.add("deactivate");
  });

  // Activate specified pages
  if (mainPage) {
    sectionFilms.classList.add("activate");
    sectionFilms.classList.remove("deactivate");
  }
  if (settingsPage) {
    settings.classList.add("activate");
    settings.classList.remove("deactivate");
  }
  if (bookmarksPage) {
    bookmarks.classList.add("activate");
    bookmarks.classList.remove("deactivate");
  }
}
listOfBtns.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    let id = btn.getAttribute("id");
    switch (id) {
      case "series-btn":
        getTV(TV_POPULAR_URL);
        searchURL = BASE_URL + "/search/tv?" + API_KEY;
        switchPages(true, false, false);
        break;
      case "movies-btn":
        getMovies(MOVIE_POPULAR_URL);
        searchURL = BASE_URL + "/search/movie?" + API_KEY;
        switchPages(true, false, false);
        break;
      case "actors-btn":
        getActors(PERSONS_POPULAR_URL);
        searchURL = BASE_URL + "/search/person?" + API_KEY;
        switchPages(true, false, false);
        break;
      case "settings-btn":
        switchPages(false, true, false);

        break;
      case "bookmarks-btn":
        switchPages(false, false, true);
        getBookmarks();
        break;
    }

    toggleClassBtn(btn);
  });
});
// -------------------------------------------------------------- nav buttons events

//---------------------------------------------------------------------settings part
const acc1 = document.getElementById("acc1");
const acc2 = document.getElementById("acc2");
const acc3 = document.getElementById("acc3");
const accountsBoxes = document.querySelectorAll(".acc");
const colors = document.querySelectorAll(".color-box");
const btnSave = document.getElementById("save");
const btnDelete = document.getElementById("delete");
const userMain = mainUser.querySelector(".user-logo");
let nameChangerP = document.getElementById("name-changer-p");

accountsBoxes.forEach((acc) => {
  acc.addEventListener("click", function (e) {
    
    // if clicked acc has name its set to be the main acc---------------
    if (
      e.target.closest(".acc").querySelector(".acc-name").textContent != "+"
    ) {
      mainUser.querySelector(".user-logo").firstChild.textContent = e.target
        .closest(".acc")
        .querySelector(".acc-name")
        .textContent[0].toUpperCase();
      mainUser.querySelector(".user-name").textContent =
        e.target
          .closest(".acc")
          .querySelector(".acc-name")
          .textContent[0].toUpperCase() +
        e.target
          .closest(".acc")
          .querySelector(".acc-name")
          .textContent.slice(1);
      // removing colors and puting only the one from the clicked acc
      userMain.classList.remove(
        ...Array.from(userMain.classList).filter(
          (className) => className !== "user-logo"
        )
      );
      if (e.target.closest(".acc").querySelector(".user-logo").classList[1]) {
        let colorr = e.target.closest(".acc").querySelector(".user-logo")
          .classList[1];
        userMain.classList.add(`${colorr}`);
      }
      mainUser.classList.forEach((classs) => {
        if (classs !== "user") {
          mainUser.classList.remove(`${classs}`);
        }
      });
      let idbookmark = e.target.closest(".acc").id;
      mainUser.classList.add(`${idbookmark}`);
      document.querySelector(".btn-edit").textContent = "Edit";
    } else {
      document.querySelector(".btn-edit").textContent = "Create";
    }
    // if clicked acc has name its set to be the main acc---------------

    document.querySelector(".edit-section").classList.remove("deactivate");
    document.querySelector(".btn-edit").addEventListener("click", function () {
      document.querySelector(".settings-reveal").classList.remove("deactivate");
      nameChangerP.focus();
      document.querySelector(".edit-section").classList.add("deactivate");
      let listOfAcc = ["acc1", "acc2", "acc3"];
      let indexOfAcc = listOfAcc.indexOf(acc.id);
      listOfAcc.splice(indexOfAcc, 1);
      listOfAcc.forEach((acc) => {
        document.querySelector(`.${acc}`).style.pointerEvents = "none";
      });
    });
    let curid = e.target.closest(".acc").id;
    accountsBoxes.forEach((acc) => {
      if (acc.id == curid) {
        acc.classList.add("border-glow");
      } else {
        acc.classList.remove("border-glow");
      }
    });
    if (document.querySelector(".border-glow").getAttribute("id") == "acc1") {
      btnDelete.classList.add("deactivate");
    } else {
      btnDelete.classList.remove("deactivate");
    }
    if (
      e.target.closest(".acc").querySelector(".acc-name").textContent != "+"
    ) {
      nameChangerP.value = e.target
        .closest(".acc")
        .querySelector(".acc-name").textContent;
    } else {
      nameChangerP.value = "";
    }
    nameChangerP.classList.add("border-glow");
    nameChangerP.focus();

    let mainColor = "";
    colors.forEach((color) => {
      color.addEventListener("click", function () {
        let curAccId = document.querySelector(".border-glow").id;

        if (curAccId == "acc1") {
          acc1.querySelector(".user-logo").classList.forEach((color) => {
            if (color !== "user-logo") {
              e.target
                .closest(".acc")
                .querySelector(".user-logo")
                .classList.remove(`${color}`);
            }
          });
          acc1
            .querySelector(".user-logo")
            .classList.add(`${color.classList[0]}`);
        }

        if (curAccId == "acc2") {
          acc2.querySelector(".user-logo").classList.forEach((color) => {
            if (color !== "user-logo") {
              e.target
                .closest(".acc")
                .querySelector(".user-logo")
                .classList.remove(`${color}`);
            }
          });
          acc2
            .querySelector(".user-logo")
            .classList.add(`${color.classList[0]}`);
        }

        if (curAccId == "acc3") {
          acc3.querySelector(".user-logo").classList.forEach((color) => {
            if (color !== "user-logo") {
              e.target
                .closest(".acc")
                .querySelector(".user-logo")
                .classList.remove(`${color}`);
            }
          });
          acc3
            .querySelector(".user-logo")
            .classList.add(`${color.classList[0]}`);
        }

        mainColor = "";
        mainColor = color.classList[0];
      });
    });

    btnSave.addEventListener("click", function () {
      if (nameChangerP.value.length >= 9) {
        alert(
          "The name you want to save is to long, please use less then 9 charaters!"
        );
      }
      let listOfAcc = ["acc1", "acc2", "acc3"];
      listOfAcc.forEach((acc) => {
        document.querySelector(`.${acc}`).style.pointerEvents = "auto";
      });
      document.querySelector(".edit-section").classList.add("deactivate");
      document.querySelector(".settings-reveal").classList.add("deactivate");
      let curAccId = document.querySelector(".border-glow").id;
      switch (curAccId) {
        case "acc1":
          acc1.querySelector(".acc-name").textContent =
            nameChangerP.value[0].toUpperCase() + nameChangerP.value.slice(1);
          acc1.querySelector(".user-logo").textContent =
            nameChangerP.value[0].toUpperCase();
          break;
        case "acc2":
          acc2.querySelector(".acc-name").textContent =
            nameChangerP.value[0].toUpperCase() + nameChangerP.value.slice(1);
          acc2.querySelector(".user-logo").textContent =
            nameChangerP.value[0].toUpperCase();
          break;
        case "acc3":
          acc3.querySelector(".acc-name").textContent =
            nameChangerP.value[0].toUpperCase() + nameChangerP.value.slice(1);
          acc3.querySelector(".user-logo").textContent =
            nameChangerP.value[0].toUpperCase();
          break;
        default:
          break;
      }

      mainUser.querySelector(".user-logo").classList.forEach((color) => {
        if (color !== "user-logo") {
          mainUser.querySelector(".user-logo").classList.remove(`${color}`);
        }
      });
      mainUser.querySelector(".user-logo").firstChild.textContent =
        nameChangerP.value[0].toUpperCase();
      mainUser.querySelector(".user-name").textContent =
        nameChangerP.value[0].toUpperCase() + nameChangerP.value.slice(1);

      let name = nameChangerP.value.toLowerCase();
      let color = mainColor;
      if (color.length < 1) {
        if (curAccId == "acc1") {
          if (acc1.querySelector(".user-logo").classList.length == 1) {
            color = "blue";
          } else {
            color = acc1.querySelector(".user-logo").classList[1];
          }
        }
        if (curAccId == "acc2") {
          if (acc2.querySelector(".user-logo").classList.length == 1) {
            color = "blue";
          } else {
            color = acc2.querySelector(".user-logo").classList[1];
          }
        }
        if (curAccId == "acc3") {
          if (acc3.querySelector(".user-logo").classList.length == 1) {
            color = "blue";
          } else {
            color = acc3.querySelector(".user-logo").classList[1];
          }
        }
      }

      if (mainColor.length < 1) {
        mainUser.querySelector(".user-logo").classList.add(`${color}`);
      } else {
        mainUser.querySelector(".user-logo").classList.add(`${mainColor}`);
      }
      let info = [name, color];
      localStorage.setItem(curAccId, info);
      localStorage.setItem("acc", curAccId);
    });

    btnDelete.addEventListener("click", function () {
      let curAccId = document.querySelector(".border-glow").id;
      let listOfAcc = ["acc1", "acc2", "acc3"];
      listOfAcc.forEach((acc) => {
        document.querySelector(`.${acc}`).style.pointerEvents = "auto";
      });
      document.querySelector(".settings-reveal").classList.add("deactivate");
      if (curAccId == "acc2") {
        acc2.querySelector(".acc-name").textContent = "+";
        acc2.querySelector(".user-logo").textContent = "";
        document
          .querySelector(".accounts")
          .querySelector(`.${curAccId}`)
          .classList.remove("border-glow");
        acc2.querySelector(".user-logo").classList.forEach((color) => {
          if (color !== "user-logo") {
            acc2.querySelector(".user-logo").classList.remove(`${color}`);
          }
        });
      }
      if (curAccId == "acc3") {
        acc3.querySelector(".acc-name").textContent = "+";
        acc3.querySelector(".user-logo").textContent = "";

        document
          .querySelector(".accounts")
          .querySelector(`.${curAccId}`)
          .classList.remove("border-glow");
        acc3.querySelector(".user-logo").classList.forEach((color) => {
          if (color !== "user-logo") {
            acc3.querySelector(".user-logo").classList.remove(`${color}`);
          }
        });
      }

      let accs = document.querySelector(".accounts");
      localStorage.setItem("acc", "acc1");
      let acc1 = accs.querySelector(".acc1");
      let ime = acc1.querySelector(".acc-name").textContent;
      let boja = acc1.querySelector(".user-logo").classList[1];
      mainUser.querySelector(".user-logo").classList.forEach((color) => {
        if (color !== "user-logo") {
          mainUser.querySelector(".user-logo").classList.remove(`${color}`);
        }
      });
      if (boja) {
        mainUser.querySelector(".user-logo").classList.add(`${boja}`);
      }
      mainUser.querySelector(".user-logo").firstChild.textContent =
        ime[0].toUpperCase();
      mainUser.querySelector(".user-name").textContent =
        ime[0].toUpperCase() + ime.slice(1);

      localStorage.setItem(`${curAccId}`, []);
      localStorage.setItem(`bookmarksTV${curAccId}`, JSON.stringify([]));
      localStorage.setItem(`bookmarksMovie${curAccId}`, JSON.stringify([]));
    });
    nameChangerP.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    });
  });
});
//---------------------------------------------------------------------settings part

//mobile nav bar-------------------------------------------------
const menu = document.querySelector(".btn-mobile-nav");
const header = document.querySelector(".nav-bar");
const setMenu = () => {
  header.classList.toggle("nav-open");
  document.querySelector(".body").classList.toggle("scroll-none");
};
menu.addEventListener("click", setMenu);
