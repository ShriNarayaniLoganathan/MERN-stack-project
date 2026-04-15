import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

export default function AuthPage() {
  const { token, login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "register") {
        await register(form);
        setMessage("Account created. Your dashboard is ready.");
      } else {
        await login({
          email: form.email,
          password: form.password,
        });
        setMessage("Login successful.");
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to continue right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="hero-layout">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Cab Booking Application</p>
            <h1 className="hero-title">Book, track, and manage every ride in one MERN flow.</h1>
            <p className="hero-copy">
              This build follows your document with fare estimation, driver assignment,
              live ride progress, trip history, and protected access using JWT.
            </p>
          </div>

          <div className="hero-grid">
            <div className="stat-card">
              <strong>3</strong>
              <span>Cab categories with dynamic pricing</span>
            </div>
            <div className="stat-card">
              <strong>JWT</strong>
              <span>Authentication and protected ride routes</span>
            </div>
            <div className="stat-card">
              <strong>Live</strong>
              <span>Status tracking from assignment to completion</span>
            </div>
          </div>
        </section>

        <section className="hero-panel auth-panel">
          <div className="auth-header">
            <div>
              <p className="eyebrow">Access</p>
              <h2>{mode === "login" ? "Welcome back" : "Create your rider account"}</h2>
            </div>

            <div className="toggle-group">
              <button
                className={mode === "login" ? "active" : ""}
                onClick={() => setMode("login")}
                type="button"
              >
                Login
              </button>
              <button
                className={mode === "register" ? "active" : ""}
                onClick={() => setMode("register")}
                type="button"
              >
                Register
              </button>
            </div>
          </div>

          <form className="stack" onSubmit={handleSubmit}>
            {mode === "register" ? (
              <div className="field">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  onChange={handleChange}
                  placeholder="Aarav Sharma"
                  required
                  value={form.name}
                />
              </div>
            ) : null}

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="you@example.com"
                required
                type="email"
                value={form.email}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                minLength="6"
                name="password"
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
                type="password"
                value={form.password}
              />
            </div>

            <div className="button-row">
              <button className="button" disabled={loading} type="submit">
                {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
              </button>
            </div>
          </form>

          {error ? <div className="message error">{error}</div> : null}
          {message ? <div className="message success">{message}</div> : null}
        </section>
      </div>
    </div>
  );
}
