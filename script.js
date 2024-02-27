// Get references to HTML elements
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const key='9efe2270';
// Function to load movies from the OMDB API based on the search term
async function loadMovies(searchTerm) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=9efe2270`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if (data.Response == "True") {
        // If the API response is successful, display the list of movies
        displayMovieList(data.Search);
    }
}

// Initial function call when searching for movies
function findMovies() {
    let searchTerm = (movieSearchBox.value).trim();
    if (searchTerm.length > 0) {
        // Display search list if there is a search term
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        // Hide search list if there is no search term
        searchList.classList.add('hide-search-list');
    }
}

// Display the list of movies in the search results
function displayMovieList(movies) {
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        // Create HTML elements for each movie in the search results
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // Setting movie id in data-id
        movieListItem.classList.add('search-list-item');
        let moviePoster = (movies[idx].Poster != "N/A") ? movies[idx].Poster : "image_not_found.png";

        // Populate the movie list item HTML
        movieListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${moviePoster}">
            </div>
            <div class="search-item-info">
                <h3>${movies[idx].Title}</h3>
                <p>${movies[idx].Year}</p>
            </div>
        `;
        searchList.appendChild(movieListItem);
    }
    // Attach click event listeners to each movie item for loading details
    loadMovieDetails();
}

// Load movie details when a movie is clicked in the search list
function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // Fetch details for the selected movie
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=9efe2270`);
            const movieDetails = await result.json();
            // Display the details of the selected movie
            displayMovieDetails(movieDetails);
        });
    });
}

// Display detailed information about a selected movie
function displayMovieDetails(details) {
    resultGrid.innerHTML = `
        <div class="movie-poster">
            <img src="${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt="movie poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
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
            <div class="dh-rs">
                <i class="fa-solid fa-bookmark" onClick=addTofavorites('${details.imdbID}') style="cursor: pointer;"></i>
            </div>
        </div>
    `;
}
async function favoritesMovieLoader() {

    var output = ''
    //Traversing over all the movies in the localstorage
    for (i in localStorage) {
        var id = localStorage.getItem(i);
        // var id='tt0800369';
        if (id != null) {
            //Fetching the movie through id 
            const url = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${key}`
            const res = await fetch(`${url}`);
            const data = await res.json();
            console.log(data);


            var img = ''
            if (data.Poster) {
                img = data.Poster
            }
            else { img = data.Title }
            var Id = data.imdbID;
            //Adding all the movie html in the output using interpolition
            output += `

        <div class="fav-item">
            <div class="fav-poster">
                <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name">${data.Title}</p>
                        <p class="fav-movie-rating">${data.Year} &middot; <span
                                style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                    </div>
                    <div style="color: maroon">
                        <i class="fa-solid fa-trash" style="cursor:pointer;" onClick=removeFromfavorites('${Id}')></i>
                    </div>
                </div>
            </div>
        </div>

       `;
        }

    }
    //Appending the html to the movie-display class in favorites page 
    document.querySelector('.favourite-grid').innerHTML = output;
    // resultGrid.innerHTML=output;
}
async function addTofavorites(id) {
    console.log("fav-item", id);

    localStorage.setItem(Math.random().toString(36).slice(2, 7), id);// math.random for the unique key and value pair
    alert('Movie Added to Watchlist!');
}
async function removeFromfavorites(id) {
    console.log(id);
    for (i in localStorage) {
        // If the ID passed as argument matches with value associated with key, then removing it 
        if (localStorage[i] == id) {
            localStorage.removeItem(i)
            break;
        }
    }
    //Alerting the user and refreshing the page
    alert('Movie Removed from Watchlist');
    window.location.replace('favourite.html');
}


// Hide search list when clicking outside the search box
// window.addEventListener('click', (event) => {
//     if (event.target.className != "form-control") {
//         searchList.classList.add('hide-search-list');
//     }
// });
