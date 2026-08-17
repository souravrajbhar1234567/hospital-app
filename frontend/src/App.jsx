import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Doctors from "./components/Doctors";
import Services from "./components/Services";
import Appointment from "./components/Appointment";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import MyAppointments from "./pages/MyAppointments";
import DoctorDashboard from "./pages/DoctorDashboard";

import ProtectedRoute from "./components/ProtectedRoute.jsx";


// =====================================================
// HOME PAGE
// =====================================================

function HospitalHome() {
  return (
    <div className="app-shell">

      <div className="ambient-background">

        <div className="ambient-orb ambient-orb-one"></div>

        <div className="ambient-orb ambient-orb-two"></div>

        <div className="ambient-orb ambient-orb-three"></div>

      </div>

      <Navbar />

      <main className="main-content">

        <Home />

        <Doctors />

        <Services />

        <Appointment />

      </main>

      <Footer />

    </div>
  );
}


// =====================================================
// AUTH LAYOUT
// =====================================================

function AuthLayout({ children }) {
  return (
    <div className="app-shell">

      <div className="ambient-background">

        <div className="ambient-orb ambient-orb-one"></div>

        <div className="ambient-orb ambient-orb-two"></div>

        <div className="ambient-orb ambient-orb-three"></div>

      </div>

      <Navbar />

      <main className="auth-main">

        {children}

      </main>

    </div>
  );
}


// =====================================================
// ANIMATED ROUTES
// =====================================================

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">

      <Routes
        location={location}
        key={location.pathname}
      >

        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={
            <HospitalHome />
          }
        />


        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />


        {/* =================================================
            REGISTER
        ================================================= */}

        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />


        {/* =================================================
            PATIENT APPOINTMENTS
        ================================================= */}

        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <MyAppointments />
              </AuthLayout>
            </ProtectedRoute>
          }
        />


        {/* =================================================
            DOCTOR DASHBOARD
        ================================================= */}

        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <HospitalHome />
          }
        />

      </Routes>

    </AnimatePresence>
  );
}


// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>

      <AnimatedRoutes />

    </BrowserRouter>
  );
}


export default App;