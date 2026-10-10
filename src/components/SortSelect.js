import { useEffect, useRef, useState } from 'react';

const OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'year-desc', label: 'Year (Newest first)' },
  { value: 'year-asc', label: 'Year (Oldest first)' },
  { value: 'rating-desc', label: 'Rating (Highest first)' },
  { value: 'rating-asc', label: 'Rating (Lowest first)' },
];

// A custom dropdown instead of <select>, because the browser decides where a
// <select> list opens. This one always opens directly above the button.
function SortSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const current = OPTIONS.find((option) => option.value === value) || OPTIONS[0];

  // Close when clicking anywhere outside the dropdown, or pressing Escape.
  useEffect(() => {
    if (!open) return;
    function handleClick(event) {
      if (!containerRef.current.contains(event.target)) setOpen(false);
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function choose(optionValue) {
    onChange(optionValue);
    setOpen(false);
  }

  return (
    <div className="filter__container">
      <span id="sort-label">Sort by</span>
      <div className="sort" ref={containerRef}>
        <button
          type="button"
          id="sort-button"
          className="sort__button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby="sort-label sort-button"
          onClick={() => setOpen(!open)}
        >
          {current.label} <i className={`fa-solid fa-chevron-${open ? 'down' : 'up'}`}></i>
        </button>
        {open && (
          <ul className="sort__options" role="listbox" aria-labelledby="sort-label">
            {OPTIONS.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                tabIndex={0}
                className="sort__option"
                onClick={() => choose(option.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    choose(option.value);
                  }
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SortSelect;
