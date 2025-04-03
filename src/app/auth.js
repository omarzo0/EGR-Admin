import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const checkAuth = () => {
  // Check both localStorage and cookies for token
  const TOKEN = Cookies.get("token") || localStorage.getItem("token");
  const PUBLIC_ROUTES = [
    "login",
    "forgot-password",
    "register",
    "documentation",
  ];

  const isPublicPage = PUBLIC_ROUTES.some((r) =>
    window.location.pathname.includes(r)
  );

  if (!TOKEN) {
    if (!isPublicPage) {
      window.location.href = "/login";
    }
    return null;
  }

  try {
    const decodedToken = jwtDecode(TOKEN);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      clearAuth();
      return null;
    }

    // Set axios default headers
    axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;

    return TOKEN;
  } catch (error) {
    clearAuth();
    return null;
  }
};

const clearAuth = () => {
  Cookies.remove("token");
  localStorage.removeItem("token");
  localStorage.removeItem("adminId");
  if (!window.location.pathname.includes("login")) {
    window.location.href = "/login";
  }
};

export default checkAuth;
