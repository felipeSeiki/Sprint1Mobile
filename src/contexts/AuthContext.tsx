import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth';
import { AuthContextData, LoginCredentials, RegisterData, RegisterDataPatio, RegisterDataWithRole, User, Users, Patio } from '../types/auth';

// Chaves de armazenamento
const STORAGE_KEYS = {
  USER: '@MottuApp:user',
  TOKEN: '@MottuApp:token',
  PATIO: '@MottuApp:patio',
  LAST_AUTH_RESPONSE: '@MottuApp:lastAuthResponse',
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

      // Salva a resposta bruta para debug local (não envia para servidor externo)
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_AUTH_RESPONSE, JSON.stringify(response));
      } catch (e) {
        // não bloquear o fluxo se falhar ao gravar o debug
        console.warn('Não foi possível salvar last auth response:', e);
      }

  // Normaliza formatos diferentes de resposta que o backend pode retornar
  const anyResp: any = response;
      // Possíveis formatos:
      // { user: {...}, token: '...' }
      // { data: { user: {...}, token: '...'} }
      // { token: '...', ...userFields }
      const token = (anyResp && (anyResp.token || anyResp.accessToken)) || (anyResp?.data && (anyResp.data.token || anyResp.data.accessToken)) || null;

      let userObj: any = null;
      if (anyResp && anyResp.user) userObj = anyResp.user;
      else if (anyResp?.data && anyResp.data.user) userObj = anyResp.data.user;
      else if (anyResp?.data && typeof anyResp.data === 'object') {
        // quando backend retorna diretamente o usuário em data
        const maybeUser = anyResp.data;
        if (maybeUser && (maybeUser.login || maybeUser.username || maybeUser.id)) userObj = maybeUser;
      } else if (anyResp && typeof anyResp === 'object') {
        const maybeUser = anyResp;
        if (maybeUser && (maybeUser.login || maybeUser.username || maybeUser.id)) userObj = maybeUser;
      }

      // Persistência: grava somente quando tivermos valores
      if (userObj) {
        setUser(userObj);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObj));
      }

      if (token) {
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      }

      // Carrega o pátio se o usuário for admin (prefere consulta ao backend)
      const role = userObj?.role ?? userObj?.roles?.[0] ?? null;
      if (role === 'ADMIN') {
        try {
          const existingPatio = await authService.getPatio();
          if (existingPatio) {
            setPatio(existingPatio);
            setHasRegisteredPatio(true);
            await AsyncStorage.setItem(STORAGE_KEYS.PATIO, JSON.stringify(existingPatio));
          }
        } catch (e) {
          console.warn('Erro ao carregar pátio após login:', e);
        }
      }
    } catch (error) {
      console.error('Erro no signIn:', error);
      throw error;
    }
  };

  const register = async (data: RegisterDataWithRole | RegisterData) => {
    try {
      const response = await authService.register(data);

      // Salva resposta bruta para debug
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_AUTH_RESPONSE, JSON.stringify(response));
      } catch (e) {
        console.warn('Não foi possível salvar last auth response (register):', e);
      }

      const anyResp2: any = response;
      const token = (anyResp2 && (anyResp2.token || anyResp2.accessToken)) || (anyResp2?.data && (anyResp2.data.token || anyResp2.data.accessToken)) || null;
      let userObj: any = null;
      if (anyResp2 && anyResp2.user) userObj = anyResp2.user;
      else if (anyResp2?.data && anyResp2.data.user) userObj = anyResp2.data.user;
      else if (anyResp2?.data && typeof anyResp2.data === 'object') {
        const maybeUser = anyResp2.data;
        if (maybeUser && (maybeUser.login || maybeUser.username || maybeUser.id)) userObj = maybeUser;
      }

      if (userObj) {
        setUser(userObj);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObj));
      }
      if (token) {
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      }
    } catch (error) {
      console.error('Erro no register:', error);
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