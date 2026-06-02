"use client";
import { createContext, useContext, useState } from "react";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

function decodeUser(token: string): string | null {
  try {
    return JSON.parse(atob(token.split(".")[1])).sub ?? null;
  } catch {
    return null;
  }
}

type AuthContextType = {
  user: string | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, initialToken }: {
  children: React.ReactNode;
  initialToken?: string | null;
}) {
  const resolvedToken = initialToken ?? getCookie("token");

  const [token, setToken] = useState<string | null>(resolvedToken);
  const [user, setUser] = useState<string | null>(
    resolvedToken ? decodeUser(resolvedToken) : null
  );

  const login = (newToken: string) => {
    setCookie("token", newToken);
    setToken(newToken);
    setUser(decodeUser(newToken));
  };

  const logout = () => {
    deleteCookie("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}