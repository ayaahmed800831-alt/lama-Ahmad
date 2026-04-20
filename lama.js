const moviesContainer = document.getElementById("movies");
const detailsContainer = document.getElementById("details");
const searchInput = document.getElementById("search");

let selectedMovie = null;

function getMovieInfo(movie) {
    return {
        title: movie["#TITLE"] || "بدون عنوان",
        year: movie["#YEAR"] || "غير معروف",
        poster: movie["#IMG_POSTER"] || "",
        actors: movie["#ACTORS"] || "غير متوفر",
        imdbId: movie["#IMDB_ID"] || ""
    };
}

function fetchMovies(query = "spiderman") {
    moviesContainer.innerHTML = "جاري التحميل...";
    detailsContainer.innerHTML = "<h2> .جاري التحميل</h2>";

    const apiUrl = `https://imdb.iamidiotareyoutoo.com/search?q=${encodeURIComponent(query)}`;
    
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

    fetch(proxyUrl)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            return res.json();
        })
        .then(result => {
            
            let data;
            try {
                data = typeof result.contents === 'string' ? JSON.parse(result.contents) : result;
            } catch (e) {
                data = result;
            }

            let movies = [];
            if (data.description && Array.isArray(data.description)) {
                movies = data.description;
            }

            if (movies.length === 0) {
                moviesContainer.innerHTML = "ما لقينا أفلام 😕<br><small>جرّب: batman أو avengers أو inception</small>";
                detailsContainer.innerHTML = "<h2>لم يتم اختيار فيلم</h2>";
                return;
            }

            moviesContainer.innerHTML = "";
            
            movies.forEach(movie => {
                const info = getMovieInfo(movie);
                
                const movieCard = document.createElement("div");
                movieCard.className = "movie-card";
                movieCard.innerHTML = `
                    <img src="${info.poster}" 
                         alt="${info.title}" 
                         onerror="this.src='https://via.placeholder.com/200x300?text=No+Poster'">
                    <h3>${info.title}</h3>
                    <p>${info.year}</p>
                `;
                
                movieCard.addEventListener("click", () => showMovieDetails(info));
                moviesContainer.appendChild(movieCard);
            });

            if (movies.length > 0) {
                showMovieDetails(getMovieInfo(movies[0]));
            }
        })
        .catch(err => {
            console.error(err);
            moviesContainer.innerHTML = `خطأ في التحميل: ${err.message}<br>جرب مرة ثانية أو غيّر الكلمة`;
        });
}

function showMovieDetails(movie) {
    selectedMovie = movie;
    
    detailsContainer.innerHTML = `
        <img src="${movie.poster}" 
             alt="${movie.title}" 
             onerror="this.src='https://via.placeholder.com/400x600?text=No+Poster'">
        <h2>${movie.title}</h2>
        <p><strong>السنة:</strong> ${movie.year}</p>
        <p><strong>الممثلين:</strong> ${movie.actors}</p>
        ${movie.imdbId ? 
            `<a href="https://www.imdb.com/title/${movie.imdbId}" target="_blank" class="imdb-link">
                مشاهدة على IMDB
            </a>` : ''}
    `;
}

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) fetchMovies(query);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    fetchMovies("spiderman");
});
