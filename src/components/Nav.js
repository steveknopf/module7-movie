import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function Nav({ onHome }) {
  return (
    <section id="nav">
      <div className="nav">
        <div className="nav__header">
          <h1>Movie Finder</h1>
        </div>
        <ul className="nav__links">
          <li>
            <Link to="/" className="nav__link" onClick={onHome}>
              Home
            </Link>
          </li>
        </ul>
        <ThemeToggle />
      </div>
    </section>
  );
}

export default Nav;
