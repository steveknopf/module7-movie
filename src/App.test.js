import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const movies = {
  tt1: { imdbID: 'tt1', Title: 'Old Movie', Year: '1990', imdbRating: '6.0', Poster: 'a.jpg', Response: 'True' },
  tt2: { imdbID: 'tt2', Title: 'New Movie', Year: '2020', imdbRating: '8.5', Poster: 'b.jpg', Response: 'True' },
};

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    const params = new URL(url).searchParams;
    const body = params.get('s')
      ? { Search: Object.values(movies).map(({ imdbID, Title, Year, Poster }) => ({ imdbID, Title, Year, Poster })) }
      : movies[params.get('i')];
    return Promise.resolve({ json: () => Promise.resolve(body) });
  });
});

function renderApp(path = '/') {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

const titles = () => screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);

async function search(query) {
  fireEvent.change(screen.getByLabelText(/search through site content/i), { target: { value: query } });
  fireEvent.click(screen.getByRole('button', { name: /search/i }));
  await screen.findByText('Old Movie', {}, { timeout: 2000 });
}

test('renders the header and search bar', () => {
  renderApp();
  expect(screen.getByRole('heading', { name: 'Movie Finder' })).toBeInTheDocument();
  expect(screen.getByLabelText(/search through site content/i)).toBeInTheDocument();
});

test('searches, sorts, and opens a movie page', async () => {
  renderApp();
  await search('movie');

  expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('s=movie'));
  expect(titles()).toEqual(['Old Movie', 'New Movie']);

  fireEvent.click(screen.getByRole('button', { name: /sort by/i }));
  fireEvent.click(screen.getByRole('option', { name: /rating \(highest first\)/i }));
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(titles()).toEqual(['New Movie', 'Old Movie']);

  fireEvent.click(screen.getByText('New Movie'));
  expect(screen.getByText('8.5')).toBeInTheDocument();
  expect(screen.queryByLabelText(/search through site content/i)).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('link', { name: /back to results/i }));
  expect(screen.queryByText('8.5')).not.toBeInTheDocument();
  expect(titles()).toEqual(['New Movie', 'Old Movie']);
});

test('loads a movie page opened directly by URL', async () => {
  renderApp('/movie/tt1');
  expect(await screen.findByText('6.0')).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('i=tt1'));
});

test('shows 6 results per page and pages with numbers and arrows', async () => {
  for (let i = 3; i <= 8; i++) {
    movies[`tt${i}`] = { imdbID: `tt${i}`, Title: `Movie ${i}`, Year: '2000', imdbRating: '7.0', Poster: 'c.jpg', Response: 'True' };
  }
  renderApp();
  await search('movie');
  expect(titles()).toHaveLength(6);
  expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();

  fireEvent.click(screen.getByRole('button', { name: /next page/i }));
  expect(titles()).toEqual(['Movie 7', 'Movie 8']);
  expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();

  fireEvent.click(screen.getByRole('button', { name: '1' }));
  expect(titles()[0]).toBe('Old Movie');
  fireEvent.click(screen.getByRole('button', { name: '2' }));
  expect(titles()).toEqual(['Movie 7', 'Movie 8']);
});

test('toggles between dark and light mode', () => {
  renderApp();
  expect(document.documentElement.dataset.theme).toBe('dark');

  fireEvent.click(screen.getByRole('button', { name: /switch to light mode/i }));
  expect(document.documentElement.dataset.theme).toBe('light');

  fireEvent.click(screen.getByRole('button', { name: /switch to dark mode/i }));
  expect(document.documentElement.dataset.theme).toBe('dark');
});
