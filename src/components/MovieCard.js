import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.imdbID}`} className="movie__card">
      <h3>{movie.Title}</h3>
      <p>{movie.Year}</p>
      <img src={movie.Poster} alt={movie.Title} />
    </Link>
  );
}

export default MovieCard;
