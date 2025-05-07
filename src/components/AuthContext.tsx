import React, { createContext, useContext, useState, ReactNode } from "react";

// Định nghĩa kiểu cho context
interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  role: string | null; // Thêm role
  login: (token: string, role: string) => void; // Cập nhật login để nhận role
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider để bao bọc ứng dụng
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
    setIsLoggedIn(true);
    setToken(newToken);
    setRole(newRole);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
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
