import axios from "axios";

const api = axios.create({
  // Frontend requests:
  // /api/auth
  // /api/appointments
  // /api/doctors

  baseURL: "/api",

  // Required for cookie authentication
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});


// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config) => {
    console.log(
      `➡️ API Request: ${
        config.method?.toUpperCase()
      } ${config.baseURL}${config.url}`
    );

    return config;
  },

  (error) => {
    console.error(
      "❌ API Request Error:",
      error
    );

    return Promise.reject(error);
  }
);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ API Response: ${
        response.status
      } ${response.config.url}`,
      response.data
    );

    return response;
  },

  (error) => {
    console.error(
      "❌ API Response Error:",
      error
    );

    if (error.response) {
      console.error(
        "Status:",
        error.response.status
      );

      console.error(
        "Response:",
        error.response.data
      );
    } else if (error.request) {
      console.error(
        "No response received from backend."
      );
    } else {
      console.error(
        "Request setup error:",
        error.message
      );
    }

    return Promise.reject(error);
  }
);


export default api;