import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [paciente, setPaciente] = useState(() => {
    try {
      const saved = sessionStorage.getItem('paciente');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const login = (datosPaciente) => {
    setPaciente(datosPaciente);
    sessionStorage.setItem('paciente', JSON.stringify(datosPaciente));
  };

  const logout = () => {
    setPaciente(null);
    sessionStorage.removeItem('paciente');
  };

  return (
    <AuthContext.Provider value={{ paciente, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
