import MovieCard from './MovieCard';

function MovieList({ movies }) {
  if (movies.length === 0) {
    return (
      <div id="displayResults">
        <p>No results found.</p>
      </div>
    );
  }

  return (
    <div id="displayResults">
      {movies.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} />
      ))}
    </div>
  );
}

export default MovieList;
