import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || '/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      let msg = 'Erreur de connexion';
      try {
        const data = await res.json();
        msg = data.message || data.errors?.email?.[0] || msg;
      } catch {}
      throw new Error(msg);
    }

    const data = await res.json();

    localStorage.setItem('auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      } catch {}
    }
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    if (res.status === 401) {
      logout();
    }
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
