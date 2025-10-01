/**
 * Tipos relacionados à autenticação e autorização
 */

/**
 * Perfis de usuário disponíveis no sistema
 */
export type UserRole = "ADMIN" | "USER";

/**
 * Interface base do usuário
 */
export interface BaseUser {
  id?: string;
  user: string;
  role: UserRole;
  password: string;
}

/**
 * Interface do paciente
 */
export interface Patio {
  id: number;
  endereco: {
    cep: string;
    logradouro: string;
    numero: number;
    cidade: string;
    estado: string;
    bairro: string;
  };
  imagemPlantaUrl: string;
}

export interface User extends BaseUser {
  role: "USER";
}

export interface Admin extends BaseUser {
  role: "ADMIN";
}

/**
 * Interface do usuário autenticado
 */
export type Users = Admin | User;

/**
 * Dados necessários para login
 */
export interface LoginCredentials {
  user: string;
  password: string;
}

/**
 * Dados necessários para registro
 */
export interface RegisterData {
  user: string;
  password: string;
}

export interface RegisterDataPatio {
  endereco: {
    cep: string;
    logradouro: string;
    numero: number;
    cidade: string;
    estado: string;
    bairro: string;
  };
  imagemPlantaUrl: string;
}

/**
 * Resposta da API de autenticação
 */
export interface AuthResponse {
  user: Users;
  token: string;
}

// Removido pois já está definido acima

export interface AuthContextData {
  user: Users | null;
  patio: Patio | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  registerPatio: (data: RegisterDataPatio) => Promise<void>;
  signOut: () => Promise<void>;
  hasRegisteredPatio: boolean;
  setPatio: (patio: Patio | null) => void;
  setHasRegisteredPatio: (value: boolean) => void;
}
