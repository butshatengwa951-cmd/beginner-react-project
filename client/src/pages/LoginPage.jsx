import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login, user, loading, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <Link className="wordmark" to="/">STUDY<span>TRACKER</span></Link>
        <p className="eyebrow">YOUR LEARNING, IN ONE PLACE</p>
        <h1>Welcome back.</h1>
        <p className="muted">Sign in to pick up where you left off.</p>

        {!isFirebaseConfigured ? (
          <div className="notice">
            Firebase is not configured yet. Follow docs/02-firebase-auth.md and
            add your web-app values to client/.env.
          </div>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="error-message" role="alert">{error}</p> : null}
          <button className="button button-primary button-wide" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
        <p className="auth-footnote">A small tool for consistent progress.</p>
      </section>
      <aside className="auth-aside">
        <div className="aside-mark">✳</div>
        <p className="eyebrow">A LITTLE PROGRESS, OFTEN</p>
        <h2>Make room for the work that moves you forward.</h2>
        <p>Capture what you are learning, keep track of the next step, and see your effort add up.</p>
      </aside>
    </main>
  );
}
