import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, registerStudent as registerStudentApi, getCurrentUser } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await loginApi(credentials);
    const { token: jwt, user: userData } = response.data.data;
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    return response.data;
  };

  const register = async (data) => {
    const response = await registerApi(data);
    const { token: jwt, user: userData } = response.data.data;
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    return response.data;
  };

  const registerStudent = async (data) => {
    const response = await registerStudentApi(data);
    const { token: jwt, user: userData } = response.data.data;
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isTeacher = user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAuthenticated, isAdmin, isTeacher, isStudent,
      login, register, registerStudent, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
