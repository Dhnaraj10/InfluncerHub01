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
      fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/me`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setUser(data.user);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem("token");
            setToken(null);
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
    console.log("Attempting login with:", { email }); // For debugging
    
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // Clear timeout if request completes
      
      const data = await res.json();
      console.log("Login response:", data); // For debugging
      console.log("Login response status:", res.status); // For debugging

      if (!res.ok) {
        // Throw specific error messages based on the response
        throw new Error(data.msg || "Login failed");
      }

      setToken(data.token);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error); // For debugging
      
      // Handle timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection');
      }
      
      throw error;
    }
  };

  // 🔑 Signup
  const signup = async (name: string, email: string, password: string, role: string) => {
    console.log("Attempting signup with:", { name, email, role }); // For debugging
    
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, role }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // Clear timeout if request completes
      
      const data = await res.json();
      console.log("Signup response:", data); // For debugging
      console.log("Signup response status:", res.status); // For debugging
      
      if (!res.ok) {
        // Throw specific error messages based on the response
        throw new Error(data.msg || data.errors?.[0]?.msg || "Signup failed");
      }

      setToken(data.token);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuthenticated(true);

      return Promise.resolve(data);
    } catch (error) {
      console.error("Signup error:", error); // For debugging
      
      // Handle timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection');
      }
      
      throw error;
    }
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