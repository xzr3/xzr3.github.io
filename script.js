const apiKey = '5948fedc97ad674cabed5c55ee23246f';
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const SuggestionGrid = document.getElementById('suggestion-grid');
let searchResults = [];

// Function to select a random movie or series ID from TMDB API
async function selectRandomMediaID() {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;
  const response = await fetch(url);
  const movieData = await response.json();
  if (movieData.results && movieData.results.length > 0) {
    const randomIndex = Math.floor(Math.random() * movieData.results.length);
    return movieData.results[randomIndex].id;
  }

  const seriesURL = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}`;
  const seriesResponse = await fetch(seriesURL);
  const seriesData = await seriesResponse.json();
  if (seriesData.results && seriesData.results.length > 0) {
    const randomIndex = Math.floor(Math.random() * seriesData.results.length);
    return seriesData.results[randomIndex].id;
  }

  return null;
}

// Function to request movie or series details from the TMDB API
async function getMediaDetails(mediaID, isSearched = false) {
  const url = `https://api.themoviedb.org/3/movie/${mediaID}?api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  if (response.ok) {
    const mediaDetails = {
      imdbID: data.imdb_id,
      Title: data.title || data.name,
      Poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
      Type: data.title ? 'movie' : 'series',
      Year: data.release_date ? data.release_date.substring(0, 4) : 'N/A',
      Rated: 'N/A',
      Released: data.release_date ? data.release_date : 'N/A',
      Genre: data.genres ? data.genres.map((genre) => genre.name).join(', ') : 'N/A',
      Writer: 'N/A',
      Actors: 'N/A',
      Plot: data.overview,
      Language: data.original_language,
      Awards: 'N/A',
      isSearched: isSearched,
    };
    displayMediaDetails(mediaDetails);
  } else {
    console.log('Error:', data.status_message);
  }
}

// Usage
async function loadRandomMedia() {
  const randomMediaID = await selectRandomMediaID();
  if (randomMediaID) {
    getMediaDetails(randomMediaID);
  }
}

loadRandomMedia();

function displayMediaDetails(details) {
  const mediaId = details.imdbID;
  let videoLink;

  if (details.Type === 'movie') {
    videoLink = `https://2embed.org/embed/movie?imdb=${mediaId}`;
  } else if (details.Type === 'series') {
    videoLink = `https://vidsrc.me/embed/${mediaId}`;
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
  `;

  // Store selected media details in localStorage
  localStorage.setItem('selectedMedia', JSON.stringify(details));
}

// Load media from API
async function loadMedia(searchTerm) {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${searchTerm}`;
  const response = await fetch(url);
  const data = await response.json();
  if (response.ok && data.results && data.results.length > 0) {
    searchResults = data.results;
    localStorage.setItem('searchResults', JSON.stringify(searchResults));
    displayMediaList(searchResults);
  }
}

// JavaScript code
// ...
function findMedia() {
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

function displayMediaList(mediaList) {
  searchList.innerHTML = "";
  mediaList.forEach((media) => {
    const mediaListItem = document.createElement('div');
    const mediaType = media.title ? 'movie' : 'series';

    mediaListItem.dataset.id = media.id;
    mediaListItem.classList.add('search-list-item');

    let mediaPoster;
    if (media.poster_path) {
      mediaPoster = `https://image.tmdb.org/t/p/w500${media.poster_path}`;
    } else {
      mediaPoster = "image_not_found.png";
    }

    mediaListItem.innerHTML = `
      <div class="search-item-thumbnail">
        <img src="${mediaPoster}">
      </div>
      <div class="search-item-info">
        <h3>${media.title || media.name}</h3>
        <p>Type: ${mediaType}</p>
        <p>${media.release_date || 'N/A'}</p>
      </div>
    `;

    searchList.appendChild(mediaListItem);
  });
  loadMediaDetails();
}

function loadMediaDetails() {
  const searchListMedia = searchList.querySelectorAll('.search-list-item');
  searchListMedia.forEach((media) => {
    media.addEventListener('click', async () => {
      searchList.classList.add('hide-search-list');
      movieSearchBox.value = "";
      await getMediaDetails(media.dataset.id);
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
  displayMediaList(searchResults);
}

// Event listener for clicking on the logo
const logo = document.getElementById('logo');
logo.addEventListener('click', () => {
  loadRandomMedia();
});
