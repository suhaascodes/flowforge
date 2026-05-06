import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../api/index.js';

const AuthContext = createContext(null);
const TOKEN_KEY = 'flowforge_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const validateToken = async (nextToken) => {
    try {
      const response = await authAPI.validate(nextToken);
      setUser(response.data.data.user);
      return response.data.data.user;
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    const payload = response.data.data;
    const newToken = payload.token;

    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(payload.user);

    return payload;
  };

  const register = async ({ name, email, password, avatar = null }) => {
    const response = await authAPI.register({ name, email, password, avatar });
    const payload = response.data.data;
    const newToken = payload.token;

    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(payload.user);

    return payload;
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (_error) {
      // No-op: client-side cleanup is sufficient for current JWT flow.
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshSession: () => validateToken(token),
    isAuthenticated: Boolean(user && token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
