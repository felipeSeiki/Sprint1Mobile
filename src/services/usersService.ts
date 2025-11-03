import { mockDb } from './mockDb';
import { Users } from '../types/auth';

export const usersService = {
  // Volátil (não persiste no AsyncStorage): registros criados em runtime
  _volatile: [] as Users[],

  _genId() {
    // ID simples baseado em timestamp + contador
    return `u_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
  },

  async listByPatio(patioId: number): Promise<Users[]> {
    const base = await mockDb.listUsersByPatio(patioId);
    const overlay = this._volatile.filter(u => u.patioId === patioId);
    return [...base, ...overlay];
  },
  async update(userId: string, patch: Partial<Users>): Promise<Users> {
    // Tenta atualizar na camada volátil primeiro
    const vidx = this._volatile.findIndex(u => u.id === userId);
    if (vidx !== -1) {
      const updated = { ...this._volatile[vidx], ...patch } as Users;
      this._volatile[vidx] = updated;
      return updated;
    }
    // Se não estiver volátil, delega ao mockDb (legado)
    return await mockDb.updateUser(userId, patch);
  },
  async remove(userId: string): Promise<void> {
    // Remove primeiro da camada volátil
    const before = this._volatile.length;
    this._volatile = this._volatile.filter(u => u.id !== userId);
    if (this._volatile.length !== before) return;
    // Se não estava volátil, remove do mockDb (legado)
    await mockDb.deleteUser(userId);
  },

  async create(user: Omit<Users, 'id'> & { patioId?: number }): Promise<Users> {
    // Criação somente em memória: não persiste no AsyncStorage
    const created: Users = { ...user, id: this._genId() } as Users;
    this._volatile.push(created);
    return created;
  },
};
