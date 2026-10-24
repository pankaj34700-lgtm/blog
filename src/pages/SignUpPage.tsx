import { Link } from 'react-router-dom';

export function SignUpPage() {
  return (
    <main className="page page--narrow">
      <h1>Sign up</h1>
      <p className="page__lead">
        Accounts are coming soon. Until then, every story on BlogX is free to read without one.
      </p>
      <Link className="button button--primary" to="/">
        Back to the home page
      </Link>
    </main>
  );
}
