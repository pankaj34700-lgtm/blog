import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="page page--narrow">
      <h1>Page not found</h1>
      <p className="page__lead">That link doesn’t lead anywhere yet. The home page is a safer bet.</p>
      <Link className="button button--primary" to="/">
        Back to the home page
      </Link>
    </main>
  );
}
