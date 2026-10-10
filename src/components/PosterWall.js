import { useEffect, useRef, useState } from 'react';
import { fetchPosterMovies } from '../api';

const MIN_COLUMN_WIDTH = 180; // px, including the gap between columns
const MIN_COLUMNS = 2;
const POSTERS_PER_COLUMN = 12;

function PosterWall() {
  const [posters, setPosters] = useState([]);
  const [brokenPosters, setBrokenPosters] = useState(() => new Set());
  const [columnCount, setColumnCount] = useState(4);
  const wallRef = useRef(null);

  useEffect(() => {
    let ignore = false;
    fetchPosterMovies()
      .then((movies) => {
        if (!ignore) setPosters(movies);
      })
      .catch((error) => console.error('Could not load posters:', error));
    return () => {
      ignore = true;
    };
  }, []);

  // Fit as many columns as the wall's width allows, and update when it resizes.
  useEffect(() => {
    const wall = wallRef.current;
    if (!wall || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setColumnCount(Math.max(MIN_COLUMNS, Math.floor(width / MIN_COLUMN_WIDTH)));
    });
    observer.observe(wall);
    return () => observer.disconnect();
  }, []);

  // Drop any poster whose image failed to load
  const workingPosters = posters.filter((movie) => !brokenPosters.has(movie.Poster));

  function handleImageError(url) {
    setBrokenPosters((previous) => new Set(previous).add(url));
  }

  // Give each column 12 posters, each starting further along the list.
  // Wide screens can need more posters than we have, so wrap back to the start.
  const columns = Array.from({ length: columnCount }, (_, i) =>
    workingPosters.length === 0
      ? []
      : Array.from(
          { length: POSTERS_PER_COLUMN },
          (_, j) => workingPosters[(i * POSTERS_PER_COLUMN + j) % workingPosters.length]
        )
  );

  return (
    <div
      className="poster-wall"
      ref={wallRef}
      style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
      aria-hidden="true"
    >
      {columns.map((column, colIndex) => (
        <div className="poster-wall__column" key={colIndex}>
          <div
            className={`poster-wall__track ${
              colIndex % 2 === 0 ? 'poster-wall__track--up' : 'poster-wall__track--down'
            }`}
          >
            {/* The list twice, so the loop is seamless */}
            {[...column, ...column].map((movie, i) => (
              <img key={i} src={movie.Poster} alt="" onError={() => handleImageError(movie.Poster)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PosterWall;
