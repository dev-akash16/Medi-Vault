import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);
      }
    } catch (err) {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('medivault_token', res.data.token);
        }
        setUser(res.data.user);
        setProfile(res.data.profile);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        return res.data;
      }
    } catch (err) {
      let msg = err.response?.data?.message;
      if (!msg) {
        if (!err.response) {
          msg = 'Unable to reach backend server. Please ensure the backend is running on port 5001.';
        } else {
          msg = 'Login failed. Please check your credentials.';
        }
      }
      toast.error(msg);
      throw err;
    }
  };

  const registerPatient = async (patientData) => {
    try {
      const res = await api.post('/auth/register/patient', patientData);
      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('medivault_token', res.data.token);
        }
        setUser(res.data.user);
        setProfile(res.data.profile);
        toast.success(`Welcome to MediVault, ${res.data.user.name}!`);
        return res.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      throw err;
    }
  };

  const registerDoctor = async (doctorData) => {
    try {
      const res = await api.post('/auth/register/doctor', doctorData);
      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('medivault_token', res.data.token);
        }
        setUser(res.data.user);
        setProfile(res.data.profile);
        toast.success('Doctor account registered! Pending administrator verification.');
        return res.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('medivault_token');
      setUser(null);
      setProfile(null);
      toast.success('Logged out successfully.');
    }
  };

  const refreshProfile = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        login,
        registerPatient,
        registerDoctor,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
