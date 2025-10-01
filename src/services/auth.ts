import AsyncStorage from '@react-native-async-storage/async-storage';
import { Admin, AuthResponse, LoginCredentials, RegisterData, RegisterDataPatio, User, Users, Patio, UserRole } from '../types/auth';
import { Moto } from '../types/motos';
import { api } from '../config/api';

// Chaves de armazenamento
const STORAGE_KEYS = {
  USER: '@MottuApp:user',
  TOKEN: '@MottuApp:token',
  PATIO: '@MottuApp:patio',
  REGISTERED_USERS: '@MottuApp:registeredUsers',
  MOTOS: '@MottuApp:motos',
};

// Motos mockadas para teste
const mockMotos = [
  {
    id: '1',
    modelo: 'Honda CB 500',
    placa: 'ABC-1234',
    cod_tag: 'TAG001',
    status: 'Disponível',
    posicaoX: '2',
    posicaoY: '0',
  },
  {
    id: '2',
    modelo: 'Yamaha MT-07',
    placa: 'DEF-5678',
    cod_tag: 'TAG002',
    status: 'Manutenção',
    posicaoX: '3',
    posicaoY: '1',
  },
  {
    id: '3',
    modelo: 'Kawasaki Ninja 400',
    placa: 'GHI-9012',
    cod_tag: 'TAG003',
    status: 'Reservada',
    posicaoX: '4',
    posicaoY: '2',
  },
];

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
    if (!credentials.user || !credentials.password) {
      throw new Error('Usuário e senha são obrigatórios');
    }

    try {
      // Busca o usuário pelo username
      const response = await api.get(`/users?user=${credentials.user}`);
      const users = response.data;
      
      // Verifica se encontrou o usuário e se a senha está correta
      const user = users.find((u: Users) => u.user === credentials.user && u.password === credentials.password);
      
      if (!user) {
        throw new Error('Usuário ou senha inválidos');
      }

      // Gera um token mock (em produção isso seria feito pelo servidor)
      const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));
      
      // Salva o usuário no storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);

      return {
        user,
        token,
      };
    } catch (error: any) {
      console.error('Erro no login:', error.response || error);
      if (error.message === 'Usuário ou senha inválidos') {
        throw error;
      }
      throw new Error('Erro ao fazer login. Tente novamente.');
    }
  },

  async checkPatioExists(): Promise<boolean> {
    try {
      const response = await api.get('/api/patio/exists');
      return response.data.exists;
    } catch (error) {
      console.error('Erro ao verificar existência do pátio:', error);
      return false;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      if (!data.user || !data.password) {
        throw new Error('Usuário e senha são obrigatórios');
      }

      // Verifica se o usuário já existe
      const existingUsers = await api.get(`/users?user=${data.user}`);
      if (existingUsers.data.length > 0) {
        throw new Error('Usuário já existe');
      }

      // Cria o novo usuário
      const newUser = {
        user: data.user,
        password: data.password,
        role: 'USER' as UserRole
      };

      const response = await api.post('/users', newUser);
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
      const patio = response.data;
      
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
      const motosJson = await AsyncStorage.getItem(STORAGE_KEYS.MOTOS);
      if (motosJson) {
        return JSON.parse(motosJson);
      }
      // If no motos stored, use mock data
      await AsyncStorage.setItem(STORAGE_KEYS.MOTOS, JSON.stringify(mockMotos));
      return mockMotos;
    } catch (error) {
      console.error('Erro ao carregar motos:', error);
      return mockMotos;
    }
  },

  async addMoto(newMoto: Omit<Moto, 'id'>): Promise<Moto> {
    try {
      const motos = await this.getAllMotos();
      const moto = {
        ...newMoto,
        id: String(motos.length + 1)
      };
      
      motos.push(moto);
      await AsyncStorage.setItem(STORAGE_KEYS.MOTOS, JSON.stringify(motos));
      
      return moto;
    } catch (error) {
      console.error('Erro ao adicionar moto:', error);
      throw new Error('Falha ao adicionar moto');
    }
  },

  async updateMotoStatus(id: string, status: string): Promise<Moto | null> {
    try {
      const motos = await this.getAllMotos();
      const moto = motos.find(m => m.id === id);
      
      if (moto) {
        moto.status = status;
        await AsyncStorage.setItem(STORAGE_KEYS.MOTOS, JSON.stringify(motos));
        return moto;
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
      await AsyncStorage.removeItem(STORAGE_KEYS.MOTOS);
      // Reinicializa com os dados mockados
      await AsyncStorage.setItem(STORAGE_KEYS.MOTOS, JSON.stringify(mockMotos));
      // Notifica todos os subscribers sobre a mudança
      this.subscribers.forEach(callback => callback(mockMotos));
    } catch (error) {
      console.error('Erro ao resetar storage:', error);
    }
  },
};