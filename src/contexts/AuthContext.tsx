import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth';
import { AuthContextData, LoginCredentials, RegisterData, RegisterDataPatio, User, Users, Patio } from '../types/auth';

// Chaves de armazenamento
const STORAGE_KEYS = {
  USER: '@MottuApp:user',
  TOKEN: '@MottuApp:token',
  PATIO: '@MottuApp:patio',
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Users | null>(null);
  const [patio, setPatio] = useState<Patio | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRegisteredPatio, setHasRegisteredPatio] = useState(false);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedUser = await authService.getStoredUser();
      
      if (storedUser) {
        setUser(storedUser);
        
        // Se for admin, verifica a existência do pátio no backend
        if (storedUser.role === 'ADMIN') {
          const existingPatio = await authService.getPatio();
          if (existingPatio) {
            setPatio(existingPatio);
            setHasRegisteredPatio(true);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.signIn(credentials);
      setUser(response.user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      
      // Carrega o pátio se o usuário for admin
      if (response.user.role === 'ADMIN') {
        const storedPatio = await authService.getStoredPatio();
        if (storedPatio) {
          setPatio(storedPatio);
          setHasRegisteredPatio(true);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const registerPatio = async (data: RegisterDataPatio) => {
    try {
      const patio = await authService.registerPatio(data);
      setPatio(patio);
      setHasRegisteredPatio(true);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        patio,
        loading, 
        signIn, 
        register, 
        registerPatio,
        signOut,
        hasRegisteredPatio,
        setPatio,
        setHasRegisteredPatio 
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