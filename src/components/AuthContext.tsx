import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });
  const [role, setRole] = useState<string | null>(() => {
    return localStorage.getItem("role");
  });

  const login = (newToken: string, newRole: string) => {
    if (!newToken || !newRole) {
      console.error("Invalid login data:", { newToken, newRole });
      throw new Error("Token and role are required for login");
    }
    const normalizedRole = newRole.toLowerCase();
    setIsLoggedIn(true);
    setToken(newToken);
    setRole(normalizedRole);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", normalizedRole);
    console.log("Login successful, stored:", {
      token: newToken,
      role: normalizedRole,
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setRole(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
