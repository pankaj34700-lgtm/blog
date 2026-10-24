import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';

export function SignInPage() {
  const { status, error, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'signedIn') {
      navigate('/', { replace: true });
    }
  }, [status, navigate]);

  return (
    <main className="page page--narrow">
      <h1>Sign in</h1>
      <p className="page__lead">
        Use your Google account to sign in to BlogX. One click, no new password to remember.
      </p>

      {error && (
        <p className="form-error" role="alert">
          {error.message}
        </p>
      )}

      <button
        type="button"
        className="button button--primary button--google"
        onClick={() => void signInWithGoogle()}
        disabled={status === 'resolving'}
      >
        Continue with Google
      </button>

      <p className="page__hint">
        Signing in creates a BlogX account linked to your Google profile. We store your name,
        email, and avatar only.
      </p>
    </main>
  );
}
