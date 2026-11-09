import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const { register, user, loading, isFirebaseConfigured } = useAuth();
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

    if (password.length < 6) {
      setError("Use a password with at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password);
      navigate("/dashboard");
    } catch (registerError) {
      setError(registerError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <Link className="wordmark" to="/">STUDY<span>TRACKER</span></Link>
        <p className="eyebrow">START WHERE YOU ARE</p>
        <h1>Create your space.</h1>
        <p className="muted">Set up an account to keep your learning tasks together.</p>

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
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>
          {error ? <p className="error-message" role="alert">{error}</p> : null}
          <button className="button button-primary button-wide" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
        <p className="auth-footnote">Your progress belongs to you.</p>
      </section>
      <aside className="auth-aside">
        <div className="aside-mark">✳</div>
        <p className="eyebrow">BEGIN WITH ONE THING</p>
        <h2>Turn an intention into a next step.</h2>
        <p>Use this project to practise React, understand authentication, and connect an API to a spreadsheet.</p>
      </aside>
    </main>
  );
}
