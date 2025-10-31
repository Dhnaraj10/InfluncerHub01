// src/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "./types/types";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // Load user if token exists
  useEffect(() => {
    if (token) {
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setUser(data);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
            setToken(null);
            localStorage.removeItem("token");
          }
        })
        .catch(() => {
          setUser(null);
          setIsAuthenticated(false);
        });
    }
  }, [token]);

  // 🔑 Login
  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await res.json();
    console.log("Login response:", data); // For debugging

    if (!res.ok) {
      // Throw specific error messages based on the response
      throw new Error(data.msg || "Login failed");
    }

    setToken(data.token);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  // 🔑 Signup
  const signup = async (name: string, email: string, password: string, role: string) => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    
    const data = await res.json();
    console.log("Signup response:", data); // For debugging
    
    if (!res.ok) {
      // Throw specific error messages based on the response
      throw new Error(data.msg || data.errors?.[0]?.msg || "Signup failed");
    }

    setToken(data.token);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  // 🚪 Logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};