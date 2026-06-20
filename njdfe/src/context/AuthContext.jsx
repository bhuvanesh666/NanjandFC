import { createContext, useState, useContext } from "react";
import api from "../api/axios";
const Ctx = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const login = async (username, password) => {
    const res = await api.post("/accounts/login/", { username, password });
    const { access, refresh, username: uname, role, email } = res.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    const u = { username: uname, role, email };
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u); return u;
  };
  const register = async (data) => {
    const res = await api.post("/accounts/register/", data);
    return res.data;
  };
  const logout = () => { localStorage.clear(); setUser(null); };
  return (
    <Ctx.Provider value={{
      user, login, register, logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      isPlayer: user?.role === "player",
    }}>
      {children}
    </Ctx.Provider>
  );
}
export const useAuth = () => useContext(Ctx);
