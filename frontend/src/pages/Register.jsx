import React, { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.password
    ) {
      setError(
        "Please fill in all fields."
      );

      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    setLoading(true);

    const result = await register(form);

    setLoading(false);

    if (!result.success) {
      setError(
        result.message ||
          "Unable to create account."
      );

      return;
    }

    navigate("/login");
  };

  return (
    <main className="auth-page">

      <div className="auth-background-glow"></div>

      <section className="auth-card register-card">

        <div className="auth-logo">
          <span>+</span>
          HealthCare+
        </div>

        <div className="auth-heading">

          <p className="auth-eyebrow">
            PATIENT PORTAL
          </p>

          <h1>
            Create your account
          </h1>

          <p>
            Join Rekha Hospital and
            manage your appointments
            easily.
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

            <label htmlFor="name">
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />

          </div>


          <div className="input-row">

            <div className="input-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />

            </div>


            <div className="input-group">

              <label htmlFor="phone">
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="9876543210"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
              />

            </div>

          </div>


          <div className="input-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />

          </div>


          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </button>

        </form>


        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Sign in
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Register;