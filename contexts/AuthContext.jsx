"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  // Validate and restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser && !isTokenExpired(storedToken)) {
      setUser(JSON.parse(storedUser));
    } else {
      // Clear invalid/expired session
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (pathname !== "/login") {
        router.push("/login");
      }
    }
    setLoading(false);
  }, []);

  // Check token expiration periodically
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (isTokenExpired(token)) {
        logout();
        router.push("/login");
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user, router]);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const hasPermission = (page) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    return user.permissions?.includes(page) || false;
  };

  const hasTableAccess = (table, accessType) => {
    // accessType can be 'view', 'edit', 'delete'
    if (!user) return false;
    if (user.role === "admin") return true; // Admin has all access

    // Check if user has permission to the page first
    if (!user.permissions?.includes(table)) return false;

    // If no tableAccess defined, deny access (new security model)
    if (!user.tableAccess || !user.tableAccess[table]) return false;

    // Check specific access level
    return user.tableAccess[table].includes(accessType);
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        hasPermission,
        hasTableAccess,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
