import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { AlertContext } from "./alertContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null); // { profile, token }
  const [loading, setLoading] = useState(true); // new loading state
  const timeoutRef = useRef(null);
  const { showAlert } = useContext(AlertContext);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserState(parsed);
        resetIdleTimer(parsed.accessToken);
      } catch (err) {
        console.error("Failed to parse stored user", err);
        localStorage.removeItem("user");
      }
    }
    setLoading(false); // done loading
  }, []);

  // Internal function to update state + localStorage together
  const setUser = (newUser) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
      localStorage.setItem("logout", Date.now()); // sync across tabs
    }
  };

  const login = (profile, accessToken, refreshToken) => {
    setUser({ profile, accessToken, refreshToken });
    resetIdleTimer(accessToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    clearTimeout(timeoutRef.current);
    showAlert("Logged out", "error");
  };

  const resetIdleTimer = (token = user?.accessToken) => {
    if (!token) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      logout();
      showAlert(
        "Session expired due to inactivity. Please log in again.",
        "error"
      );
    }, 5 * 60 * 1000); // 5 min idle
  };

  // Listen to user activity to reset the idle timer
  useEffect(() => {
    if (!user?.accessToken) return;

    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    const handleActivity = () => resetIdleTimer();

    events.forEach((e) => window.addEventListener(e, handleActivity));
    resetIdleTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      clearTimeout(timeoutRef.current);
    };
  }, [user]);

  // Listen for logout events from other tabs
  useEffect(() => {
    const syncLogout = (e) => {
      if (e.key === "logout") {
        setUserState(null);
        clearTimeout(timeoutRef.current);
      }
    };
    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) return null;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/users/refresh-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: refreshToken }),
        }
      );

      if (!res.ok) {
        logout();
        return null;
      }

      const data = await res.json();
      const newAccessToken = data.accessToken;

      setUser((prev) => ({
        ...prev,
        accessToken: newAccessToken,
      }));

      return newAccessToken;
    } catch (err) {
      console.error("Failed to refresh access token", err);
      logout();
      return null;
    }
  };

  async function authFetch(url, options = {}) {
    let token = user?.accessToken;
    if (!token) throw new Error("No access token available");

    let res = await fetch(`${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let data = await res.json();

    // If 401, try to refresh token
    if (res.status === 401 && user?.refreshToken) {
      token = await refreshAccessToken(user.refreshToken);
      if (token) {
        options.headers.Authorization = `Bearer ${token}`;
        res = await fetch(url, options);
        data = await res.json(); // await JSON again
      }
    }

    if (!res.ok) {
      // You can throw here like login
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  async function authPost(url, body = {}, options = {}) {
    // Grab current access token
    let token = user?.accessToken;
    if (!token) throw new Error("No access token available");

    // Build request options
    let fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    };

    let res = await fetch(url, fetchOptions);
    let data = await res.json();

    // If 401, try to refresh token and retry
    if (res.status === 401 && user?.refreshToken) {
      token = await refreshAccessToken(user.refreshToken);
      if (token) {
        fetchOptions.headers.Authorization = `Bearer ${token}`;
        res = await fetch(url, fetchOptions);
        data = await res.json();
      }
    }

    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        authFetch,
        authPost,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
