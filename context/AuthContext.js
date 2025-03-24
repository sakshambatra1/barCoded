// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [refreshToken, setRefreshToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const token = await SecureStore.getItemAsync('refreshToken');
        const email = await SecureStore.getItemAsync('userEmail');
        if (token) {
          setRefreshToken(token);
        }
        if (email) {
          setUserEmail(email);
        }
      } catch (err) {
        console.error('Error loading credentials:', err);
      }
      setIsLoading(false);
    };
    loadCredentials();
  }, []);

  const login = async (token, email) => {
    try {
      await SecureStore.setItemAsync('refreshToken', token);
      await SecureStore.setItemAsync('userEmail', email);
      setRefreshToken(token);
      setUserEmail(email);
    } catch (err) {
      console.error('Error saving credentials:', err);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('userEmail');
      setRefreshToken(null);
      setUserEmail(null);
    } catch (err) {
      console.error('Error deleting credentials:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ refreshToken, userEmail, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
