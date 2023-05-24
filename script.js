const apiKey = '5948fedc97ad674cabed5c55ee23246f';
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
let searchResults = [];

<<<<<<< HEAD
// Function to request movie details from the TMDB API
function getMovieDetails(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const movieDetails = {
        id: data.id,
        title: data.title,
        poster_path: data.poster_path,
        release_date: data.release_date,
        vote_average: data.vote_average,
        cast: '', // Add code to get the cast from the API response
        awards: '', // Add code to get the awards from the API response
        mediaType: 'movie' // Set the media type to 'movie' for movies
      };
      displayMediaDetails(movieDetails);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Function to request series details from the TMDB API
function getSeriesDetails(seriesId) {
  const url = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const seriesDetails = {
        id: data.id,
        name: data.name,
        poster_path: data.poster_path,
        release_date: data.first_air_date,
        vote_average: data.vote_average,
        cast: '', // Add code to get the cast from the API response
        awards: '', // Add code to get the awards from the API response
        mediaType: 'series' // Set the media type to 'series' for TV series
      };
      displayMediaDetails(seriesDetails);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Load movies/series from API
=======
// Function to request movie/series details from the TMDB API
async function getMediaDetails(mediaId) {
  const url = `https://api.themoviedb.org/3/movie/${mediaId}?api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  if (response.ok) {
    const mediaDetails = {
      id: data.id,
      title: data.title,
      poster_path: data.poster_path,
      release_date: data.release_date
    };
    displayMediaDetails(mediaDetails);
  }
}

// Function to select a random media ID from TMDB
function selectRandomMediaID() {
  const randomIndex = Math.floor(Math.random() * movieDatabase.length);
  return movieDatabase[randomIndex];
}

// Function to handle the search logic
function performSearch() {
  const searchText = movieSearchBox.value.trim();

  if (searchText === "") {
    searchList.classList.add("hide-search-list");
    return;
  }

  loadMedia(searchText);
}

// Function to load media from TMDB API based on search term
async function loadMedia(searchTerm) {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${searchTerm}`;
  const response = await fetch(url);
  const data = await response.json();
  if (response.ok && data.results && data.results.length > 0) {
    searchResults = data.results;
    displayMediaList(searchResults);
  }
}

// Function to display the list of media in the search results
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

  searchList.classList.remove("hide-search-list");
  loadMediaDetails();
}

// Function to load media details when a search result is clicked
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

// Event listener for the search button
document.getElementById('search-btn').addEventListener('click', performSearch);

// Event listener for pressing Enter key in the search box
movieSearchBox.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    performSearch();
  }
});

// Event listener for clicking on the logo
const logo = document.getElementById('logo');
logo.addEventListener('click', () => {
  loadRandomMedia();
});

// Function to load a random media
async function loadRandomMedia() {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;
  const response = await fetch(url);
  const data = await response.json();
  if (response.ok && data.results && data.results.length > 0) {
    const randomIndex = Math.floor(Math.random() * data.results.length);
    const randomMedia = data.results[randomIndex];
    await getMediaDetails(randomMedia.id);
  }
}

// Initialize by loading a random media
loadRandomMedia();


function displayMediaDetails(details) {
  const mediaId = details.id;
  let videoLink;

  if (details.mediaType === 'movie') {
    videoLink = `https://2embed.org/embed/movie?tmdb=${mediaId}`;
  } else if (details.mediaType === 'series') {
    videoLink = `https://vidsrc.me/embed/${mediaId}`;
  } else {
    // Handle other types (if needed)
    videoLink = '';
  }

  resultGrid.innerHTML = `
    <div class="media-poster">
      <img src="${details.poster_path !== null ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : 'image_not_found.png'}" alt="media poster">
    </div>
    <div class="media-info">
      <h3 class="media-title">${details.title || details.name}</h3>
      ${videoLink ? `<iframe width="100%" height="270" src="${videoLink}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>` : ''}
      <ul class="media-misc-info">
        <li class="release-date">Release Date: ${details.release_date || 'N/A'}</li>
        <li class="rating">Rating: ${details.vote_average || 'N/A'}</li>
        <li class="author">Author: ${details.author || 'N/A'}</li>
        <li class="cast">Cast: ${details.cast || 'N/A'}</li>
        <li class="awards">Awards: ${details.awards || 'N/A'}</li>
      </ul>
    </div>
  `;

  // Store selected media details in localStorage
  localStorage.setItem('selectedMedia', JSON.stringify(details));
}


// Load media from API
>>>>>>> 9fa1e169c47d58f27e2e6f04b50cc4936741a5d1
async function loadMedia(searchTerm) {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${searchTerm}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.results && data.results.length > 0) {
    searchResults = data.results;
    displayMediaList(searchResults);
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
    // If search input is empty, hide the search list
    document.getElementById("search-list").classList.add("hide-search-list");
    return;
  }

  // Use the search input value to perform your search logic
  loadMedia(searchText);

  // Once the search results are obtained, display the search list
  document.getElementById("search-list").classList.remove("hide-search-list");
}

// ...

function displayMediaList(mediaList) {
  searchList.innerHTML = "";
  mediaList.forEach((media) => {
    const mediaListItem = document.createElement('div');
    const mediaType = media.media_type; // Get the type of the media

    mediaListItem.dataset.mediaId = media.id; // Store the media ID as a data attribute

    if (mediaType === 'movie') {
      mediaListItem.innerHTML = `
        <img src="${media.poster_path !== null ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : 'image_not_found.png'}" alt="media poster">
        <h3>${media.title}</h3>
      `;
    } else if (mediaType === 'tv') {
      mediaListItem.innerHTML = `
        <img src="${media.poster_path !== null ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : 'image_not_found.png'}" alt="media poster">
        <h3>${media.name}</h3>
      `;
    }

    mediaListItem.addEventListener('click', () => {
      if (mediaType === 'movie') {
        getMovieDetails(media.id);
      } else if (mediaType === 'tv') {
        getSeriesDetails(media.id);
      }
    });

    searchList.appendChild(mediaListItem);
  });
}

// Function to display media details
function displayMediaDetails(details) {
  const mediaId = details.id;
  let videoLink;

  if (details.mediaType === 'movie') {
    videoLink = `https://2embed.org/embed/movie?imdb=${mediaId}`;
  } else if (details.mediaType === 'series') {
    videoLink = `https://vidsrc.me/embed/${mediaId}`;
  } else {
    // Handle other types (if needed)
    videoLink = '';
  }

  resultGrid.innerHTML = `
    <div class="media-poster">
      <img src="${details.poster_path !== null ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : 'image_not_found.png'}" alt="media poster">
    </div>
    <div class="media-info">
      <h3 class="media-title">${details.title || details.name}</h3>
      ${videoLink ? `<iframe width="100%" height="270" src="${videoLink}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>` : ''}
      <ul class="media-misc-info">
        <li class="release-date">Release Date: ${details.release_date || 'N/A'}</li>
        <li class="rating">Rating: ${details.vote_average || 'N/A'}</li>
        <li class="author">Author: ${details.author || 'N/A'}</li>
        <li class="cast">Cast: ${details.cast || 'N/A'}</li>
        <li class="awards">Awards: ${details.awards || 'N/A'}</li>
      </ul>
    </div>
  `;

  // Store selected media details in localStorage
  localStorage.setItem('selectedMedia', JSON.stringify(details));
}
