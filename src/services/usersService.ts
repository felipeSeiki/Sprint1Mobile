import { mockDb } from './mockDb';
import { Users } from '../types/auth';

export const usersService = {
  async _getNextId(): Promise<string> {
    // Gera ID sequencial simples baseado nos usuários existentes
    const allUsers = await mockDb.getUsers();
    const maxId = allUsers.reduce((max, user) => {
      const numId = user.id ? parseInt(user.id) : 0;
      return !isNaN(numId) && numId > max ? numId : max;
    }, 0);
    return String(maxId + 1);
  },

  async listByPatio(patioId: number): Promise<Users[]> {
    return await mockDb.listUsersByPatio(patioId);
  },

  async update(userId: string, patch: Partial<Users>): Promise<Users> {
    return await mockDb.updateUser(userId, patch);
  },

  async remove(userId: string): Promise<void> {
    await mockDb.deleteUser(userId);
  },

  async create(user: Omit<Users, 'id'> & { patioId?: number }): Promise<Users> {
    // Agora persiste no mockDb com ID sequencial
    const id = await this._getNextId();
    const created: Users = { ...user, id } as Users;
    
    // Adiciona ao mockDb (persiste no AsyncStorage)
    const allUsers = await mockDb.getUsers();
    const updatedUsers = [...allUsers, created];
    await mockDb.setUsers(updatedUsers);
    
    return created;
  },
};
