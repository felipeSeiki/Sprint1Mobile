import AsyncStorage from '@react-native-async-storage/async-storage';
import { Admin, AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth';

// Chaves de armazenamento
const STORAGE_KEYS = {
  USER: '@MedicalApp:user',
  TOKEN: '@MedicalApp:token',
  REGISTERED_USERS: '@MedicalApp:registeredUsers',
};

// Motos mockadas para teste
const mockMotos = [
  {
    id: '1',
    modelo: 'Honda CB 500',
    placa: 'ABC-1234',
    cod_tag: 'TAG001',
    status: 'Disponível',
    posicaoX: '10',
    posicaoY: '20',
  },
  {
    id: '2',
    modelo: 'Yamaha MT-07',
    placa: 'DEF-5678',
    cod_tag: 'TAG002',
    status: 'Manutenção',
    posicaoX: '2',
    posicaoY: '15',
  },
  {
    id: '3',
    modelo: 'Kawasaki Ninja 400',
    placa: 'GHI-9012',
    cod_tag: 'TAG003',
    status: 'Estacionada',
    posicaoX: '4',
    posicaoY: '20',
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
    // Verifica se é o usuário padrão
    if (credentials.email === mockUser.email && credentials.password === '123456') {
      return {
        user: mockUser,
        token: 'user-token',
      };
    }

    // Verifica se é um usuário registrado
    const registeredUser = registeredUsers.find(
      (u) => u.email === credentials.email && credentials.password === '123456'
    );
    if (registeredUser) {
      return {
        user: registeredUser,
        token: `user-token-${registeredUser.id}`,
      };
    }

    throw new Error('Email ou senha inválidos');
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    // Verifica se o email já está em uso
    if (
      mockUser.email === data.email ||
      registeredUsers.some((u) => u.email === data.email)
    ) {
      throw new Error('Email já está em uso');
    }

    // Cria um novo usuário administrador
    const newUser: Admin = {
      id: `user-${registeredUsers.length + 1}`,
      name: data.name,
      email: data.email,
      role: 'admin' as const,
      image: `https://randomuser.me/api/portraits/men/${registeredUsers.length + 1}.jpg`,
      endereco: {
        cep: data.cep || '',
        logradouro: data.logradouro || '',
        numero: data.numero || '',
        cidade: data.cidade || '',
        estado: data.estado || ''
      }
    };

    registeredUsers.push(newUser);

    // Salva a lista atualizada de usuários
    await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registeredUsers));

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

  // Funções para o admin
  async getAllUsers(): Promise<User[]> {
    return [mockUser, ...registeredUsers];
  },

  async getAllDoctors(): Promise<User[]> {
    return [mockUser];
  },

  async getPatients(): Promise<User[]> {
    return registeredUsers;
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