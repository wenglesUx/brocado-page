"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (nome: string, email: string, senha: string, telefone?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar usuário do localStorage ao montar
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Salvar usuário no localStorage sempre que mudar
  useEffect(() => {
    if (isLoaded) {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  }, [user, isLoaded]);

  const login = async (email: string, senha: string): Promise<boolean> => {
    // Simulação de login - em produção, fazer chamada à API
    const savedUsers = localStorage.getItem("users");
    
    if (savedUsers) {
      try {
        const users = JSON.parse(savedUsers);
        const foundUser = users.find(
          (u: any) => u.email === email && u.senha === senha
        );
        
        if (foundUser) {
          const { senha: _, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          return true;
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error);
      }
    }
    
    // Usuário de demonstração
    if (email === "demo@exemplo.com" && senha === "demo123") {
      setUser({
        id: "demo-user",
        nome: "Usuário Demo",
        email: "demo@exemplo.com",
        telefone: "(11) 99999-9999",
      });
      return true;
    }
    
    return false;
  };

  const register = async (
    nome: string,
    email: string,
    senha: string,
    telefone?: string
  ): Promise<boolean> => {
    // Simulação de registro - em produção, fazer chamada à API
    try {
      const savedUsers = localStorage.getItem("users");
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      
      // Verificar se email já existe
      const emailExists = users.some((u: any) => u.email === email);
      if (emailExists) {
        return false;
      }
      
      const newUser = {
        id: `user-${Date.now()}`,
        nome,
        email,
        senha,
        telefone,
      };
      
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      // Fazer login automaticamente
      const { senha: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      
      return true;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Atualizar também na lista de usuários
      const savedUsers = localStorage.getItem("users");
      if (savedUsers) {
        try {
          const users = JSON.parse(savedUsers);
          const updatedUsers = users.map((u: any) =>
            u.id === user.id ? { ...u, ...userData } : u
          );
          localStorage.setItem("users", JSON.stringify(updatedUsers));
        } catch (error) {
          console.error("Erro ao atualizar usuário:", error);
        }
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
