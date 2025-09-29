import AsyncStorage from '@react-native-async-storage/async-storage';
import { Admin, AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth';
import { Moto } from '../types/motos';
import { api } from '../config/api';

// Chaves de armazenamento
const STORAGE_KEYS = {
  USER: '@MottuApp:user',
  TOKEN: '@MottuApp:token',
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

// Usuário padrão mockado
const mockUser = {
  id: 'default_user',
  name: 'Usuário Padrão',
  email: 'usuario@sistema.com',
  role: 'admin' as const,
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
    if (credentials) {
      const mockUser: Admin = await api.post('/auth/login', credentials).then(res => res.data);
      return {
        user: mockUser,
        token: 'user-token',
      };
    }

    throw new Error('Email ou senha inválidos');
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    // Cria um novo usuário administrador
    const newUser: Admin = {
      user: data.user,
      role: 'ADMIN' as const,
      password:data.password,
      // endereco: {
      //   cep: data.cep || '',
      //   logradouro: data.logradouro || '',
      //   numero: data.numero || '',
      //   cidade: data.cidade || '',
      //   estado: data.estado || ''
      // }
    };

    registeredUsers.push(newUser);

    // Salva a lista atualizada de usuários
    await api.post('/auth/register', newUser);

    return {
      user: newUser,
      token: `user-token-${newUser.id}`,
    };
  },

  async signOut(): Promise<void> {
    // Limpa os dados do usuário do AsyncStorage
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  async getStoredUser(): Promise<User | null> {
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