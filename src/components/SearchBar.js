import { useState } from 'react';

function SearchBar({ onSearch, children }) {
  const [query, setQuery] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <section className="search">
      <div className="search__box">
        <h1>Find Your Favorite Movies!</h1>
        <form id="search-form" className="search-container" onSubmit={handleSubmit}>
          <input
            type="search"
            id="search-input"
            name="q"
            placeholder="Search here..."
            aria-label="Search through site content"
            required
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button id="search-button" type="submit">
            Search
          </button>
        </form>
      </div>
      {children}
    </section>
  );
}

export default SearchBar;
