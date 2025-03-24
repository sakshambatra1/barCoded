// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('refreshToken');
        if (token) {
          setRefreshToken(token);
        }
      } catch (err) {
        console.error('Error loading refresh token:', err);
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const login = async (token) => {
    try {
      await SecureStore.setItemAsync('refreshToken', token);
      setRefreshToken(token);
    } catch (err) {
      console.error('Error saving refresh token:', err);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('refreshToken');
      setRefreshToken(null);
    } catch (err) {
      console.error('Error deleting refresh token:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ refreshToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
