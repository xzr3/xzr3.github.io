const apiKey = '8313fc63';
let movieSearchBox;
let searchList;
let resultGrid;
let searchResults = [];

// Cache DOM elements
document.addEventListener('DOMContentLoaded', () => {
  movieSearchBox = document.getElementById('movie-search-box');
  searchList = document.getElementById('search-list');
  resultGrid = document.getElementById('result-grid');

  // Add event listener for the debounced search box
  movieSearchBox.addEventListener('input', handleSearch);

  // Check if search results are stored in localStorage
  if (localStorage.getItem('searchResults')) {
    searchResults = JSON.parse(localStorage.getItem('searchResults'));
    displayMovieList(searchResults);
  }
});

let searchTimeout;

function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const searchText = movieSearchBox.value.trim();

    if (searchText === "") {
      searchList.classList.add("hide-search-list");
      return;
    }

    loadMovies(searchText);
  }, 300);
}


function getMovieDetails(randomID, isSearched = false) {
  const url = `https://www.omdbapi.com/?i=${randomID}&apikey=${apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.Response === "True") {
        const movieDetails = {
          imdbID: data.imdbID,
          Title: data.Title,
          Poster: data.Poster,
          Type: data.Type,
          Year: data.Year,
          Rated: data.Rated,
          Released: data.Released,
          Genre: data.Genre,
          Writer: data.Writer,
          Actors: data.Actors,
          Plot: data.Plot,
          Language: data.Language,
          Awards: data.Awards,
          isSearched: isSearched
        };
        displayMovieDetails(movieDetails);
      }
    })
    .catch(error => {
      console.log('Error:', error);
    });
}


function displayMovieDetails(details) {
  const movieId = details.imdbID;
  let videoLink;

  if (details.Type === 'movie') {
    videoLink = `https://embed.smashystream.com/playere.php?imdb=${movieId}`;
  } else if (details.Type === 'series') {
    videoLink = `https://embed.smashystream.com/playere.php?imdb=${movieId}&season=1&episode=1`;
  } else {
    // Handle other types (if needed)
    videoLink = '';
  }

  resultGrid.innerHTML = `
    <div class="movie-poster">
      <img src="${details.Poster !== 'N/A' ? details.Poster : 'image_not_found.png'}" alt="movie poster">
    </div>
    <div class="movie-info">
      <h3 class="movie-title">${details.Title}</h3>
      ${videoLink ? `<iframe width="100%" height="270" src="${videoLink}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>` : ''}
      <ul class="movie-misc-info">
        <li class="year">Year: ${details.Year}</li>
        <li class="rated">Ratings: ${details.Rated}</li>
        <li class="released">Released: ${details.Released}</li>
      </ul>
      <p class="genre"><b>Genre:</b> ${details.Genre}</p>
      <p class="writer"><b>Writer:</b> ${details.Writer}</p>
      <p class="actors"><b>Actors: </b>${details.Actors}</p>
      <p class="plot"><b>Plot:</b> ${details.Plot}</p>
      <p class="language"><b>Language:</b> ${details.Language}</p>
      <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
    </div>
   ${details.Type === 'series' ? `
        <div class="season-episode-selector">
          <label for="season-select">Season:</label>
          <select id="season-select"></select>
          <label for="episode-select">Episode:</label>
          <select id="episode-select"></select>
        </div>
      ` : ''}
    </div>
  `;

  if (details.Type === 'series') {
    const seasonSelect = document.getElementById('season-select');
    const episodeSelect = document.getElementById('episode-select');

    // Populate the season selector
    for (let i = 1; i <= details.totalSeasons; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.text = `Season ${i}`;
      seasonSelect.appendChild(option);
    }

    // Update the episode selector and video link when the season is changed
    seasonSelect.addEventListener('change', () => {
      const selectedSeason = parseInt(seasonSelect.value);
      const selectedEpisode = parseInt(episodeSelect.value);
      updateEpisodeSelector(movieId, selectedSeason, episodeSelect);
      updateVideoLink(movieId, selectedSeason, selectedEpisode);
    });

    // Update the video link when the episode is changed
    episodeSelect.addEventListener('change', () => {
      const selectedSeason = parseInt(seasonSelect.value);
      const selectedEpisode = parseInt(episodeSelect.value);
      updateVideoLink(movieId, selectedSeason, selectedEpisode);
    });

    // Initial population of the episode selector
    updateEpisodeSelector(movieId, 1, episodeSelect);
  }

  async function updateEpisodeSelector(movieId, selectedSeason, episodeSelect) {
    // Fetch the episode data for the selected season from the OMDB API
    const seasonUrl = `https://www.omdbapi.com/?i=${movieId}&season=${selectedSeason}&apikey=${apiKey}`;
    const response = await fetch(seasonUrl);
    const seasonData = await response.json();
  
    // Clear the episode selector
    episodeSelect.innerHTML = '';
  
    // Populate the episode selector
    for (let i = 0; i < seasonData.Episodes.length; i++) {
      const episode = seasonData.Episodes[i];
      const option = document.createElement('option');
      option.value = episode.Episode;
      option.text = `Episode ${episode.Episode}: ${episode.Title}`;
      episodeSelect.appendChild(option);
    }
  }
  

  function updateVideoLink(movieId, selectedSeason, selectedEpisode) {
    // Update the video link based on the selected season and episode
    videoLink = `https://embed.smashystream.com/playere.php?imdb=${movieId}&season=${selectedSeason}&episode=${selectedEpisode}`;
    // Update the iframe source
    const iframe = document.querySelector('.movie-info iframe');
    iframe.src = videoLink;
  }
}




// Load movies from API
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=${apiKey}`;
  const res = await fetch(URL);
  const data = await res.json();
  if (data.Response === "True") {
    searchResults = data.Search;
    localStorage.setItem('searchResults', JSON.stringify(searchResults));
    displayMovieList(searchResults);
  }
}

// JavaScript code
// ...
function findMovies() {
  // Get the search input element
  var searchBox = document.getElementById("movie-search-box");

  // Get the value entered in the search input
  var searchText = searchBox.value.trim();

  if (searchText === "") {
      // If search input is empty, show the random movie heading and hide the search list
      document.getElementById("search-list").classList.add("hide-search-list");
      return;
  }

  // Use the search input value to perform your search logic
  // ...

  // Once the search results are obtained, display the search list
  document.getElementById("search-list").classList.remove("hide-search-list");

  // Populate the search list with the search results
  // ...
}
// ...

function displayMovieList(movies) {
  searchList.innerHTML = "";
  movies.forEach((movie) => {
    const movieListItem = document.createElement('div');
    const movieType = movie.Type; // Get the type of the movie/series

    movieListItem.dataset.id = movie.imdbID; // Setting movie id in data-id
    movieListItem.classList.add('search-list-item');

    let moviePoster;
    if (movie.Poster !== "N/A") {
      moviePoster = movie.Poster;
    } else {
      moviePoster = "image_not_found.png";
    }

    movieListItem.innerHTML = `
      <div class="search-item-thumbnail">
        <img src="${moviePoster}">
      </div>
      <div class="search-item-info">
        <h3>${movie.Title}</h3>
        <p>Type: ${movieType}</p>
        <p>${movie.Year}</p>
      </div>
    `;

    searchList.appendChild(movieListItem);
  });
  loadMovieDetails();
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll('.search-list-item');
  searchListMovies.forEach((movie) => {
    movie.addEventListener('click', async () => {
      searchList.classList.add('hide-search-list');
      movieSearchBox.value = "";
      const result = await fetch(`https://omdbapi.com/?i=${movie.dataset.id}&apikey=${apiKey}`);
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}

// Event listener for clicking outside the search box
window.addEventListener('click', (event) => {
  if (event.target.id !== 'movie-search-box') {
    searchList.classList.add('hide-search-list');
  }
});

// Check if search results are stored in localStorage
if (localStorage.getItem('searchResults')) {
  searchResults = JSON.parse(localStorage.getItem('searchResults'));
  displayMovieList(searchResults);
}

// Event listener for clicking on the logo
const logo = document.getElementById('logo');
logo.addEventListener('click', () => {
  const randomMovieID = selectRandomMovieID();
  getMovieDetails(randomMovieID);
});


