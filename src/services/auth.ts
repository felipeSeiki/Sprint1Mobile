import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, LoginCredentials, RegisterData, Users, UserRole } from '../types/auth';
import { api } from '../config/api';
import { USE_MOCKS } from '../config/useMock';
import { mockDb } from './mockDb';

// Chaves de armazenamento
const STORAGE_KEYS = {
  USER: '@MottuApp:user',
  TOKEN: '@MottuApp:token',
};

export const authService = {
  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!credentials.login || !credentials.password) {
      throw new Error('Usuário e senha são obrigatórios');
    }
    try {
      // Modo mock: retorna usuários pré-definidos sem chamada à API
      if (USE_MOCKS) {
        // Busca o usuário no mockDb persistido (reflete edições feitas no app)
        const users = await mockDb.getUsers();
        const found = users.find(
          (u: any) => u.user === credentials.login && u.password === credentials.password
        );

        if (!found) {
          throw new Error('Usuário ou senha inválidos');
        }

        const token = btoa(JSON.stringify({ mock: true, role: found.role, ts: Date.now() }));
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(found));
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
        return { user: found as Users, token } as AuthResponse;
      }
      // Call backend login endpoint (expects { login, password })
  const payload = { login: credentials.login, password: credentials.password };
      const response = await api.post('/auth/login', payload);
      const data = response.data || {};

      // backend may return { token, user } or user directly
      const token = data.token ?? data.accessToken ?? null;

      // Determine whether response contains a user object or just token
      let user: any = null;
      if (data && typeof data === 'object') {
        if (data.user) {
          user = data.user;
        } else {
          // if data has typical user fields, treat it as user
          const maybeUser = data;
          if (maybeUser.id || maybeUser.login || maybeUser.user || maybeUser.name || maybeUser.email) {
            user = maybeUser;
          }
        }
      }

  const finalToken = token ?? btoa(JSON.stringify({ userId: (user && (user.id || user.login)) || credentials.login, timestamp: Date.now() }));

      // save token and user if present
      if (user) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, finalToken);

      return { user, token: finalToken } as AuthResponse;
    } catch (error: any) {
      console.error('Erro no login:', error.response || error);
      const message = error?.response?.data?.message || 'Erro ao fazer login. Tente novamente.';
      throw new Error(message);
    }
  },


  async register(data: RegisterData | any): Promise<AuthResponse> {
    try {
      if (!data.user || !data.password) {
        throw new Error('Usuário e senha são obrigatórios');
      }

      if (USE_MOCKS) {
        // Modo mock: verifica se o usuário já existe
        const users = await mockDb.getUsers();
        const existingUser = users.find((u: any) => u.user === data.user || u.login === data.user);
        
        if (existingUser) {
          throw new Error('Usuário já existe');
        }

        // Cria novo usuário mockado
        const newUser: Users = {
          id: String(Date.now()),
          user: data.user,
          login: data.user,
          password: data.password,
          role: (data.role as UserRole) ?? 'USER',
          patioId: data.patioId || undefined,
        } as Users;

        // Adiciona ao mockDb
        const allUsers = await mockDb.getUsers();
        await mockDb.setUsers([...allUsers, newUser]);

        // Gera token mock
        const token = btoa(JSON.stringify({ userId: newUser.id, timestamp: Date.now() }));

        // Salva no storage
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);

        return {
          user: newUser,
          token,
        };
      }

      // Modo API: chama backend
      const body: any = {
        login: data.user,
        password: data.password,
        role: (data.role as UserRole) ?? 'USER'
      };

      const config: any = {};
      if (data.patioId) {
        config.params = { 'id-patio': data.patioId };
      }

      const response = await api.post('/auth/register', body, config);
      const user = response.data;

      const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);

      return {
        user,
        token,
      };
    } catch (error: any) {
      console.error('Erro no registro:', error.response || error);
      
      if (error.message === 'Usuário já existe') {
        throw error;
      } else if (error.message === 'Network Error') {
        throw new Error('Erro de conexão com o servidor. Tente novamente.');
      }
      
      throw new Error('Erro ao registrar usuário. Tente novamente.');
    }
  },


  async signOut(): Promise<void> {
    // Limpa os dados do usuário do AsyncStorage
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  async getStoredUser(): Promise<Users | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (userJson) {
        return JSON.parse(userJson);
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter usuário armazenado:', error);
      return null;
    }
  },

};
