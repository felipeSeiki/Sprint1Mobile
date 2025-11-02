import { mockDb } from './mockDb';
import { Users } from '../types/auth';

export const usersService = {
  async listByPatio(patioId: number): Promise<Users[]> {
    return await mockDb.listUsersByPatio(patioId);
  },
  async update(userId: string, patch: Partial<Users>): Promise<Users> {
    return await mockDb.updateUser(userId, patch);
  },
  async remove(userId: string): Promise<void> {
    await mockDb.deleteUser(userId);
  },
};
