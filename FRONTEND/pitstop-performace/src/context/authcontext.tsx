'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

// Create the AuthContext
const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (authStatus: boolean) => {},
});

// Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode; // Explicitly define the type for children
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for token in sessionStorage or localStorage
    const token = sessionStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []); // Empty dependency array ensures it runs once on mount

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};