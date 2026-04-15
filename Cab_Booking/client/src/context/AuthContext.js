import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

const storageKey = "cab-booking-auth";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedSession = window.localStorage.getItem(storageKey);

    if (!savedSession) {
      return;
    }

    const parsedSession = JSON.parse(savedSession);
    setToken(parsedSession.token);
    setUser(parsedSession.user);
  }, []);

  const persistSession = (session) => {
    setToken(session.token);
    setUser(session.user);
    window.localStorage.setItem(storageKey, JSON.stringify(session));
  };

  const clearSession = () => {
    setToken("");
    setUser(null);
    window.localStorage.removeItem(storageKey);
  };

  const register = async (payload) => {
    const response = await authApi.register(payload);
    persistSession(response.data);
    return response.data;
  };

  const login = async (payload) => {
    const response = await authApi.login(payload);
    persistSession(response.data);
    return response.data;
  };

  const value = {
    token,
    user,
    register,
    login,
    logout: clearSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
