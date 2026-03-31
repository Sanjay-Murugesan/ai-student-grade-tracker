import React, { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../services/api";

const AuthContext = createContext(null);

const readStoredAuth = () => ({
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
  userId: localStorage.getItem("userId"),
  name: localStorage.getItem("name"),
});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  const persistAuth = (payload) => {
    const next = {
      token: payload.token,
      role: payload.role,
      userId: String(payload.userId),
      name: payload.name,
    };

    localStorage.setItem("token", next.token);
    localStorage.setItem("role", next.role);
    localStorage.setItem("userId", next.userId);
    localStorage.setItem("name", next.name);
    setAuth(next);
    return next;
  };

  const login = async (email, password) => {
    const { data } = await loginUser(email, password);
    return persistAuth(data);
  };

  const register = async (payload) => {
    const { data } = await registerUser(payload);
    return persistAuth(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    setAuth({ token: null, role: null, userId: null, name: null });
  };

  const value = {
    ...auth,
    isAuthenticated: Boolean(auth.token),
    login,
    register,
    logout,
    isStudent: () => auth.role === "STUDENT",
    isTeacher: () => auth.role === "TEACHER",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
