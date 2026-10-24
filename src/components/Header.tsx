import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';

export function Header() {
  const { status, user, signOut } = useAuth();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" to="/">
          BlogX
        </Link>
        <nav aria-label="Account">
          {status === 'resolving' && (
            <span className="auth-skeleton" role="status" aria-label="Checking sign-in status" />
          )}

          {status === 'signedOut' && (
            <Link className="button button--primary" to="/signin">
              Sign in
            </Link>
          )}

          {status === 'signedIn' && user && (
            <div className="account">
              {user.photoURL && (
                <img
                  className="account__avatar"
                  src={user.photoURL}
                  alt={`${user.displayName ?? 'User'} avatar`}
                  width={32}
                  height={32}
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="account__name">{user.displayName ?? user.email ?? 'Account'}</span>
              <button type="button" className="button button--ghost" onClick={() => void signOut()}>
                Sign out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
