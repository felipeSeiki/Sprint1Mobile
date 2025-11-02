import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_PATIOS } from '../mocks/patios.mock';
import { MOCK_USERS } from '../mocks/users.mock';
import { MOCK_MOTOS } from '../mocks/motos.mock';
import { Patio } from '../types/patios';
import { Users } from '../types/auth';
import { Moto } from '../types/motos';

const STORAGE_KEYS = {
  PATIOS: '@MottuApp:mock_patios',
  USERS: '@MottuApp:mock_users',
  MOTOS: '@MottuApp:mock_motos',
};

async function getItem<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function ensureInitialized() {
  const [patios, users, motos] = await Promise.all([
    getItem<Patio[]>(STORAGE_KEYS.PATIOS),
    getItem<Users[]>(STORAGE_KEYS.USERS),
    getItem<Moto[]>(STORAGE_KEYS.MOTOS),
  ]);

  const tasks: Promise<void>[] = [];
  if (!patios) tasks.push(setItem(STORAGE_KEYS.PATIOS, MOCK_PATIOS));
  if (!users) tasks.push(setItem(STORAGE_KEYS.USERS, MOCK_USERS));
  if (!motos) tasks.push(setItem(STORAGE_KEYS.MOTOS, MOCK_MOTOS));
  if (tasks.length) await Promise.all(tasks);
}

export const mockDb = {
  async init() {
    await ensureInitialized();
  },

  // Patios
  async getPatios(): Promise<Patio[]> {
    await ensureInitialized();
    return (await getItem<Patio[]>(STORAGE_KEYS.PATIOS)) || [];
  },
  async setPatios(list: Patio[]) {
    await setItem(STORAGE_KEYS.PATIOS, list);
  },
  async addPatio(patio: Omit<Patio, 'id'>): Promise<Patio> {
    const list = await this.getPatios();
    const nextId = (list.reduce((m, p) => Math.max(m, p.id), 0) || 0) + 1;
    const created: Patio = { ...patio, id: nextId } as Patio;
    await this.setPatios([...list, created]);
    return created;
  },
  async updatePatio(id: number, patch: Partial<Patio>): Promise<Patio> {
    const list = await this.getPatios();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Pátio não encontrado');
    const updated = { ...list[idx], ...patch, endereco: { ...list[idx].endereco, ...(patch as any).endereco } } as Patio;
    const newList = [...list];
    newList[idx] = updated;
    await this.setPatios(newList);
    return updated;
  },
  async deletePatio(id: number): Promise<void> {
    const list = await this.getPatios();
    await this.setPatios(list.filter(p => p.id !== id));
  },
  async getPatioById(id: number): Promise<Patio | null> {
    const list = await this.getPatios();
    return list.find(p => p.id === id) || null;
  },

  // Users
  async getUsers(): Promise<Users[]> {
    await ensureInitialized();
    return (await getItem<Users[]>(STORAGE_KEYS.USERS)) || [];
  },
  async setUsers(list: Users[]) {
    await setItem(STORAGE_KEYS.USERS, list);
  },
  async listUsersByPatio(patioId: number): Promise<Users[]> {
    const users = await this.getUsers();
    return users.filter((u: any) => u.patioId === patioId);
  },
  async updateUser(userId: string, patch: Partial<Users>): Promise<Users> {
    const users = await this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('Usuário não encontrado');
    const updated = { ...users[idx], ...patch } as Users;
    const newList = [...users];
    newList[idx] = updated;
    await this.setUsers(newList);
    return updated;
  },
  async deleteUser(userId: string): Promise<void> {
    const users = await this.getUsers();
    await this.setUsers(users.filter(u => u.id !== userId));
  },

  // Motos (reserva para evoluções)
  async getMotos(): Promise<Moto[]> {
    await ensureInitialized();
    return (await getItem<Moto[]>(STORAGE_KEYS.MOTOS)) || [];
  },
  async setMotos(list: Moto[]) {
    await setItem(STORAGE_KEYS.MOTOS, list);
  },

  async resetAll() {
    await Promise.all([
      setItem(STORAGE_KEYS.PATIOS, MOCK_PATIOS),
      setItem(STORAGE_KEYS.USERS, MOCK_USERS),
      setItem(STORAGE_KEYS.MOTOS, MOCK_MOTOS),
    ]);
  },
};
