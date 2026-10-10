const API_KEY = process.env.REACT_APP_OMDB_API_KEY || '4566be5d';
const BASE_URL = 'https://www.omdbapi.com/';

export async function searchMovies(query) {
  const response = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
  const data = await response.json();
  return data.Search || [];
}

export async function fetchMovieDetails(imdbID) {
  const response = await fetch(`${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`);
  return response.json();
}

// Fisher-Yates shuffle: returns a new array in random order.
function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const POSTER_SEARCH_TERMS = ['star wars', 'batman', 'harry potter', 'marvel', 'jurassic', 'pixar'];

export async function fetchPosterMovies() {
  const results = await Promise.all(POSTER_SEARCH_TERMS.map((term) => searchMovies(term)));

  const withPosters = results.flat().filter((movie) => movie.Poster && movie.Poster !== 'N/A');
  // Remove duplicates (the same movie can show up in two searches)
  const unique = withPosters.filter(
    (movie, index) => withPosters.findIndex((m) => m.imdbID === movie.imdbID) === index
  );
  // Mix the franchises together instead of keeping each search's results in a row
  return shuffle(unique);
}
