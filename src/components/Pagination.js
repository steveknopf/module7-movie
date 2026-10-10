function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="Results pages">
      <button
        className="pagination__arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`pagination__number${page === currentPage ? ' pagination__number--active' : ''}`}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
      <button
        className="pagination__arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </nav>
  );
}

export default Pagination;
