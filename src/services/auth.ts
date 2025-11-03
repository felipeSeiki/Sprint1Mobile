import AsyncStorage from '@react-native-async-storage/async-storage';
import { Admin, AuthResponse, LoginCredentials, RegisterData, RegisterDataPatio, User, Users, Patio, UserRole } from '../types/auth';
import { Moto } from '../types/motos';
import { api } from '../config/api';
import { USE_MOCKS } from '../config/useMock';
import { MOCK_USERS } from '../mocks/users.mock';
import { mockDb } from './mockDb';
import { MOCK_MOTOS } from '../mocks/motos.mock';
import { MOCK_PATIOS } from '../mocks/patios.mock';

// Chaves de armazenamento
const STORAGE_KEYS = {
  USER: '@MottuApp:user',
  TOKEN: '@MottuApp:token',
  PATIO: '@MottuApp:patio',
  REGISTERED_USERS: '@MottuApp:registeredUsers',
  MOTOS: '@MottuApp:motos',
};

// Referência para os mocks importados
const mockMotos = MOCK_MOTOS;

// Pátio padrão mockado
const mockPatio = {
  id: 'default_patio',
  nome: 'Pátio Principal',
  endereco: {
    cep: '00000-000',
    logradouro: 'Rua Principal',
    numero: '1',
    cidade: 'São Paulo',
    estado: 'SP'
  },
  capacidade: 50,
  status: 'ativo'
};

// Usuário padrão mockado
const mockUser = {
  id: 'default_user',
  name: 'Usuário Padrão',
  email: 'usuario@sistema.com',
  role: 'ADMIN' as UserRole,
  image: 'https://randomuser.me/api/portraits/men/3.jpg',
  endereco: {
    cep: '00000-000',
    logradouro: 'Rua Exemplo',
    numero: '123',
    cidade: 'São Paulo',
    estado: 'SP'
  }
};

// Lista de usuários cadastrados (pacientes)
let registeredUsers: User[] = [];

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

  async checkPatioExists(): Promise<boolean> {
    try {
      const response = await api.get('/api/patio');
      const data = response.data;
      if (Array.isArray(data)) return data.length > 0;
      return !!data;
    } catch (error) {
      console.error('Erro ao verificar existência do pátio:', error);
      return false;
    }
  },

  async register(data: RegisterData | any): Promise<AuthResponse> {
    try {
      if (!data.user || !data.password) {
        throw new Error('Usuário e senha são obrigatórios');
      }

      // Cria o novo usuário (map para os campos esperados pelo backend)
      const body: any = {
        login: data.user,
        password: data.password,
        role: (data.role as UserRole) ?? 'USER'
      };

      // Se o backend espera id-patio como query param, passamos se existir
      const config: any = {};
      if (data.patioId) {
        config.params = { 'id-patio': data.patioId };
      }

      const response = await api.post('/auth/register', body, config);
      const user = response.data;

      // Gera um token mock (em produção isso seria feito pelo servidor)
      const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));

      // Salva o usuário e token no storage
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

  async registerPatio(data: RegisterDataPatio): Promise<Patio> {
    // Verifica se já existe um pátio registrado
    const exists = await this.checkPatioExists();
    if (exists) {
      throw new Error('Já existe um pátio registrado no sistema');
    }

    // Registra o novo pátio
    const response = await api.post('/api/patio', data);
    const patio = response.data;

    // Salva o pátio no storage local
    await AsyncStorage.setItem(STORAGE_KEYS.PATIO, JSON.stringify(patio));

    return patio;
  },

  async getPatio(): Promise<Patio | null> {
    try {
      // Primeiro tenta obter do backend
      const response = await api.get('/api/patio');
      const data = response.data;
      const patio = Array.isArray(data) ? data[0] ?? null : data;

      // Atualiza o storage local
      if (patio) {
        await AsyncStorage.setItem(STORAGE_KEYS.PATIO, JSON.stringify(patio));
      }

      return patio;
    } catch (error) {
      console.error('Erro ao obter pátio do backend:', error);
      // Se falhar, tenta obter do storage local
      return this.getStoredPatio();
    }
  },

  // Novo método para vincular usuário a um pátio
  async linkUserToPatio(userId: string, patioId: string): Promise<void> {
    await api.post('/user/link-patio', { userId, patioId });
    
    // Atualiza o usuário local se for o usuário atual
    const currentUser = await this.getStoredUser();
    if (currentUser && currentUser.id === userId) {
      const updatedUser = {
        ...currentUser,
        patioId
      };
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
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

  async getStoredPatio(): Promise<Patio | null> {
    try {
      const patioJson = await AsyncStorage.getItem(STORAGE_KEYS.PATIO);
      if (patioJson) {
        return JSON.parse(patioJson);
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter pátio armazenado:', error);
      return null;
    }
  },

  // Função para carregar usuários registrados ao iniciar o app
  async loadRegisteredUsers(): Promise<void> {
    try {
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      if (usersJson) {
        registeredUsers = JSON.parse(usersJson);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários registrados:', error);
    }
  },
};

export const motoService = {
  subscribers: new Set<(motos: Moto[]) => void>(),

  subscribe(callback: (motos: Moto[]) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  },

  async getAllMotos(): Promise<Moto[]> {
    try {
      // Use fonte única via mockDb para evitar divergência de chaves/formatos
      await mockDb.init();
      const motos = await mockDb.getMotos();
      // Se por algum motivo vier vazio, re-seed com mocks atuais
      if (!motos || motos.length === 0) {
        await mockDb.setMotos(mockMotos);
        return mockMotos;
      }
      return motos;
    } catch (error) {
      console.error('Erro ao carregar motos:', error);
      return mockMotos;
    }
  },

  async addMoto(newMoto: Omit<Moto, 'id'>): Promise<Moto> {
    try {
      const list = await this.getAllMotos();
      const moto: Moto = {
        ...newMoto,
        id: String((list.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) || 0) + 1),
      };
      const updated = [...list, moto];
      await mockDb.setMotos(updated);
      // notifica inscritos
      this.subscribers.forEach(cb => cb(updated));
      return moto;
    } catch (error) {
      console.error('Erro ao adicionar moto:', error);
      throw new Error('Falha ao adicionar moto');
    }
  },

  async updateMotoStatus(id: string, status: string): Promise<Moto | null> {
    try {
      const list = await this.getAllMotos();
      const idx = list.findIndex(m => m.id === id);
      if (idx >= 0) {
        const updatedMoto: Moto = { ...list[idx], status };
        const updated = [...list];
        updated[idx] = updatedMoto;
        await mockDb.setMotos(updated);
        this.subscribers.forEach(cb => cb(updated));
        return updatedMoto;
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar status da moto:', error);
      throw new Error('Falha ao atualizar status da moto');
    }
  },

  async getMotoById(id: string): Promise<Moto | undefined> {
    const motos = await this.getAllMotos();
    return motos.find(moto => moto.id === id);
  },

  async getMotosByStatus(status: string): Promise<Moto[]> {
    const motos = await this.getAllMotos();
    return motos.filter(moto => moto.status === status);
  },

  async resetStorage(): Promise<void> {
    try {
      await mockDb.setMotos(mockMotos);
      this.subscribers.forEach(callback => callback(mockMotos));
    } catch (error) {
      console.error('Erro ao resetar storage:', error);
    }
  },
};