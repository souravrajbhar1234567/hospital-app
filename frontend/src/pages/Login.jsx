import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting login:", email);

      const result = await login(email, password);

      console.log("Login result:", result);

      if (!result || !result.success) {
        setError(
          result?.message ||
            "Unable to login. Please check your email and password."
        );
        return;
      }

      console.log("Login successful");
      console.log("Logged in user:", result.user);
      console.log("User role:", result.user?.role);

      if (result.user?.role === "doctor") {
        navigate("/doctor-dashboard", {
          replace: true,
        });
      } else {
        navigate("/", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        console.error("Login status:", error.response.status);
        console.error("Login response:", error.response.data);

        setError(
          error.response.data?.message ||
            "Login failed. Please try again."
        );
      } else if (error.request) {
        console.error("No response received from server.");

        setError(
          "Cannot connect to the server. Please make sure the backend is running."
        );
      } else {
        setError(
          error.message ||
            "Unable to login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-background-glow"></div>

      <section className="auth-card">

        <div className="auth-logo">
          <span>+</span>
          HealthCare+
        </div>

        <div className="auth-heading">
          <p className="auth-eyebrow">
            HEALTHCARE PORTAL
          </p>

          <h1>Welcome back</h1>

          <p>
            Sign in to manage your healthcare journey.
          </p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="input-group">
            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

        </form>

        <div className="auth-footer">
          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Create account
          </Link>
        </div>

      </section>
    </main>
  );
}

export default Login;