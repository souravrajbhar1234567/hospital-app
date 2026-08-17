import React, { useState } from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

import "../styles/navbar.css";


function Navbar() {
  const navigate =
    useNavigate();

  const {
    user,
    loading,
    isAuthenticated,
    logout,
  } = useAuth();


  const [profileOpen, setProfileOpen] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      await logout();

    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }

    setProfileOpen(false);
    setMobileOpen(false);

    navigate("/");
  };


  // =====================================================
  // CLOSE MOBILE
  // =====================================================

  const closeMobile = () => {
    setMobileOpen(false);
  };


  // =====================================================
  // CLOSE PROFILE
  // =====================================================

  const closeProfile = () => {
    setProfileOpen(false);
  };


  return (
    <header className="navbar">

      <div className="navbar-inner">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={() => {
            closeMobile();
            closeProfile();
          }}
        >

          <span className="logo-plus">
            +
          </span>

          <span>
            HealthCare
            <span className="logo-accent">
              +
            </span>
          </span>

        </Link>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav className="navbar-links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Home
          </NavLink>


          <a
            href="/#doctors"
            className="nav-link"
          >
            Doctors
          </a>


          <a
            href="/#services"
            className="nav-link"
          >
            Services
          </a>


          <a
            href="/#appointment"
            className="nav-link"
          >
            Appointment
          </a>

        </nav>


        {/* =================================================
            AUTH SECTION
        ================================================= */}

        <div className="navbar-auth">

          {/* LOADING */}

          {loading ? (

            <div className="auth-loading">
              <span></span>
            </div>

          ) : !isAuthenticated ? (

            /* =================================================
               LOGGED OUT
            ================================================= */

            <>

              <Link
                to="/login"
                className="login-button"
              >
                Login
              </Link>


              <Link
                to="/register"
                className="register-button"
              >
                Register
              </Link>

            </>

          ) : (

            /* =================================================
               LOGGED IN
            ================================================= */

            <div className="profile-wrapper">

              {/* PROFILE BUTTON */}

              <button
                type="button"
                className="profile-button"
                onClick={() =>
                  setProfileOpen(
                    (previous) =>
                      !previous
                  )
                }
              >

                <span className="profile-avatar">

                  {user?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}

                </span>


                <span className="profile-name">

                  {user?.name ||
                    "Patient"}

                </span>


                <span
                  className={`profile-arrow ${
                    profileOpen
                      ? "open"
                      : ""
                  }`}
                >
                  ▼
                </span>

              </button>


              {/* =================================================
                  PROFILE DROPDOWN
              ================================================= */}

              {profileOpen && (

                <div className="profile-dropdown">

                  {/* PROFILE HEADER */}

                  <div className="profile-header">

                    <div className="profile-large-avatar">

                      {user?.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "U"}

                    </div>


                    <div className="profile-info">

                      <strong>
                        {user?.name ||
                          "Patient"}
                      </strong>

                      <span>
                        {user?.email || ""}
                      </span>

                    </div>

                  </div>


                  <div className="profile-divider"></div>


                  {/* HOME */}

                  <Link
                    to="/"
                    className="profile-menu-item"
                    onClick={closeProfile}
                  >

                    <span>
                      ⌂
                    </span>

                    Home

                  </Link>


                  {/* BOOK APPOINTMENT */}

                  <a
                    href="/#appointment"
                    className="profile-menu-item"
                    onClick={closeProfile}
                  >

                    <span>
                      ▣
                    </span>

                    Book Appointment

                  </a>


                  {/* MY APPOINTMENTS */}

                  <Link
                    to="/my-appointments"
                    className="profile-menu-item"
                    onClick={closeProfile}
                  >

                    <span>
                      ◷
                    </span>

                    My Appointments

                  </Link>


                  <div className="profile-divider"></div>


                  {/* LOGOUT */}

                  <button
                    type="button"
                    className="profile-logout"
                    onClick={handleLogout}
                  >

                    <span>
                      ↪
                    </span>

                    Logout

                  </button>

                </div>

              )}

            </div>
          )}

        </div>


        {/* =================================================
            MOBILE BUTTON
        ================================================= */}

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMobileOpen(
              (previous) =>
                !previous
            )
          }
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
        >

          <span></span>
          <span></span>
          <span></span>

        </button>

      </div>


      {/* =================================================
          MOBILE MENU
      ================================================= */}

      {mobileOpen && (

        <div className="mobile-menu">

          {/* HOME */}

          <NavLink
            to="/"
            onClick={closeMobile}
          >
            Home
          </NavLink>


          {/* DOCTORS */}

          <a
            href="/#doctors"
            onClick={closeMobile}
          >
            Doctors
          </a>


          {/* SERVICES */}

          <a
            href="/#services"
            onClick={closeMobile}
          >
            Services
          </a>


          {/* APPOINTMENT */}

          <a
            href="/#appointment"
            onClick={closeMobile}
          >
            Appointment
          </a>


          {/* =================================================
              LOGGED OUT
          ================================================= */}

          {!loading &&
            !isAuthenticated && (

              <div className="mobile-auth">

                <Link
                  to="/login"
                  onClick={closeMobile}
                >
                  Login
                </Link>


                <Link
                  to="/register"
                  onClick={closeMobile}
                >
                  Register
                </Link>

              </div>
            )}


          {/* =================================================
              LOGGED IN
          ================================================= */}

          {!loading &&
            isAuthenticated && (

              <div className="mobile-auth">

                {/* USER */}

                <div className="mobile-user">

                  👤{" "}

                  {user?.name ||
                    "Patient"}

                </div>


                {/* MY APPOINTMENTS */}

                <Link
                  to="/my-appointments"
                  onClick={closeMobile}
                >
                  📅 My Appointments
                </Link>


                {/* BOOK APPOINTMENT */}

                <a
                  href="/#appointment"
                  onClick={closeMobile}
                >
                  🩺 Book Appointment
                </a>


                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </div>
            )}

        </div>
      )}

    </header>
  );
}


export default Navbar;