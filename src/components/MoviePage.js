import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchMovieDetails } from '../api';
import Spinner from './Spinner';

const HIDDEN_FIELDS = ['Response', 'imdbID', 'Poster', 'Ratings', 'Title'];

function MoviePage({ movies }) {
  const { imdbID } = useParams();
  const cachedMovie = movies.find((movie) => movie.imdbID === imdbID);
  const [fetchedMovie, setFetchedMovie] = useState(null);
  const movie = cachedMovie || fetchedMovie;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [imdbID]);

  // Fetch the details when the page is opened directly (e.g. a shared link or refresh).
  useEffect(() => {
    if (cachedMovie) return;
    let ignore = false;
    fetchMovieDetails(imdbID).then((data) => {
      if (!ignore) setFetchedMovie(data);
    });
    return () => {
      ignore = true;
    };
  }, [imdbID, cachedMovie]);

  if (!movie) return <Spinner />;

  return (
    <section className="movie__page">
      <Link to="/" className="movie__back">
        <i className="fa-solid fa-arrow-left"></i> Back to results
      </Link>
      {movie.Response === 'False' ? (
        <p>Movie not found.</p>
      ) : (
        <>
          <h2 className="movie__title">{movie.Title}</h2>
          <div className="movie__details">
            <img src={movie.Poster} alt={movie.Title} />
            <div className="movie__info">
              {Object.entries(movie)
                .filter(([key, value]) => !HIDDEN_FIELDS.includes(key) && value !== 'N/A')
                .map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> {value}
                  </p>
                ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default MoviePage;
