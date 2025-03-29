import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      const result = await authService.login(email, password);
      
      if (result.token) {
        localStorage.setItem('token', result.token);
        setCurrentUser({ token: result.token });
        navigate('/users');
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;