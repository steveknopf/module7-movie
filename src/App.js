import { useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { fetchMovieDetails, searchMovies } from './api';
import Nav from './components/Nav';
import SearchBar from './components/SearchBar';
import SortSelect from './components/SortSelect';
import Spinner from './components/Spinner';
import MovieList from './components/MovieList';
import Pagination from './components/Pagination';
import PosterWall from './components/PosterWall';
import MoviePage from './components/MoviePage';
import Footer from './components/Footer';

const RESULTS_PER_PAGE = 6;

const SORTERS = {
  'year-desc': (movie) => -parseInt(movie.Year),
  'year-asc': (movie) => parseInt(movie.Year),
  'rating-desc': (movie) => -parseFloat(movie.imdbRating),
  'rating-asc': (movie) => parseFloat(movie.imdbRating),
};

function sortMovies(movies, sortValue) {
  const getKey = SORTERS[sortValue];
  if (!getKey) return movies;
  // Movies without a year/rating ("N/A") always go to the end.
  const key = (movie) => {
    const value = getKey(movie);
    return Number.isNaN(value) ? Infinity : value;
  };
  return [...movies].sort((a, b) => key(a) - key(b));
}

function App() {
  const [movies, setMovies] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortValue, setSortValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const sortedMovies = useMemo(() => sortMovies(movies, sortValue), [movies, sortValue]);
  const totalPages = Math.ceil(sortedMovies.length / RESULTS_PER_PAGE);
  const pageMovies = sortedMovies.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  async function handleSearch(query) {
    setLoading(true);
    setMovies([]);
    setSortValue('');
    setCurrentPage(1);
    try {
      const results = await searchMovies(query);
      const details = await Promise.all(results.map((item) => fetchMovieDetails(item.imdbID)));
      await new Promise((resolve) => setTimeout(resolve, 800));
      setMovies(details);
    } catch (error) {
      console.error('Search failed:', error);
      setMovies([]);
    } finally {
      setHasSearched(true);
      setLoading(false);
    }
  }

  function handleHome() {
    setMovies([]);
    setHasSearched(false);
    setSortValue('');
    setCurrentPage(1);
  }

  function handleSortChange(value) {
    setSortValue(value);
    setCurrentPage(1);
  }

  return (
    <>
      <div id="page__content">
        <Nav onHome={handleHome} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SearchBar onSearch={handleSearch}>{!hasSearched && <PosterWall />}</SearchBar>
                {hasSearched && !loading && <SortSelect value={sortValue} onChange={handleSortChange} />}
                {loading && <Spinner />}
                {hasSearched && !loading && (
                  <>
                    <MovieList movies={pageMovies} />
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  </>
                )}
              </>
            }
          />
          <Route path="/movie/:imdbID" element={<MoviePage movies={movies} />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
