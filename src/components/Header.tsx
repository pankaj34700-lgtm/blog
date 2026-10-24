import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" to="/">
          BlogX
        </Link>
        <nav aria-label="Account">
          <Link className="button button--primary" to="/signup">
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
