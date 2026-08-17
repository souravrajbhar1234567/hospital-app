import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me");

      console.log("Current user response:", response.data);

      if (
        response.data?.success &&
        response.data?.user
      ) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Fetch current user error:",
        error.response?.data || error.message
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      console.log(
        "Auth login response:",
        response.data
      );

      if (response.data?.success) {
        const loggedInUser =
          response.data.user;

        setUser(loggedInUser);

        return {
          success: true,
          user: loggedInUser,
        };
      }

      return {
        success: false,
        message:
          response.data?.message ||
          "Login failed",
      };
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to login. Please try again.",
      };
    }
  };

  const register = async (formData) => {
    try {
      const response = await api.post(
        "/auth/register",
        formData
      );

      if (response.data?.success) {
        return {
          success: true,
          user: response.data.user,
        };
      }

      return {
        success: false,
        message:
          response.data?.message ||
          "Registration failed",
      };
    } catch (error) {
      console.error(
        "Register error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to create account.",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data || error.message
      );
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    fetchCurrentUser,
    isAuthenticated: Boolean(user),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}