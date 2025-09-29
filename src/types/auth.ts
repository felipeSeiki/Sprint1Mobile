/**
 * Tipos relacionados à autenticação e autorização
 */

/**
 * Perfis de usuário disponíveis no sistema
 */
export type UserRole = "ADMIN" | "OPERATOR";

/**
 * Interface base do usuário
 */
export interface BaseUser {
  id: string;
  user: string;
  role: UserRole;
  password: string;
}

/**
 * Interface do paciente
 */
export interface Operator extends BaseUser {
  role: "OPERATOR";
}

/**
 * Interface do administrador
 */
export interface Address {
  cep: string;
  logradouro: string;
  numero: string;
  cidade: string;
  estado: string;
}

export interface Admin extends BaseUser {
  role: "ADMIN";
  endereco?: Address;
}

/**
 * Interface do usuário autenticado
 */
export type User = Admin | Operator;

/**
 * Dados necessários para login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Dados necessários para registro
 */
export interface RegisterData {
  user: string;
  password: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  cidade?: string;
  estado?: string;
}

/**
 * Resposta da API de autenticação
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Contexto de autenticação
 */
export interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  signOut: () => Promise<void>;
}
