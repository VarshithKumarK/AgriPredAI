import { createContext, useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user"); // ✅ Use "user" instead of "token"
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(localStorage.getItem("token") || ""); // ✅ Store token separately

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }, // ✅ Send token in headers
        });
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (error) {
        console.log("User Not Authorized", error);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]); // ✅ Re-fetch user when token changes

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data.user);
      setToken(res.data.token); // ✅ Store token in state
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token); // ✅ Save token
    } catch (error) {
      console.log("Login Error:", error);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      setToken("");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast.success("Logged Out Succcessfully");
       // ✅ Remove token on logout
    } catch (error) {
      console.log("Logout Error at AuthContext", error);
      toast.success("Logging out Failed!!");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
