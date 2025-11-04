import { Moto } from '../types/motos';
import { USE_MOCKS } from '../config/useMock';
import { MOCK_MOTOS } from '../mocks/motos.mock';
import { mockDb } from './mockDb';

// Referência para os mocks importados
const mockMotos = MOCK_MOTOS;

export const motoService = {
  subscribers: new Set<(motos: Moto[]) => void>(),

  subscribe(callback: (motos: Moto[]) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  },

  async getAllMotos(): Promise<Moto[]> {
    try {
      if (USE_MOCKS) {
        // Use fonte única via mockDb para evitar divergência de chaves/formatos
        await mockDb.init();
        const motos = await mockDb.getMotos();
        // Se por algum motivo vier vazio, re-seed com mocks atuais
        if (!motos || motos.length === 0) {
          await mockDb.setMotos(mockMotos);
          return mockMotos;
        }
        return motos;
      }
      // TODO: Implementar chamada à API quando USE_MOCKS = false
      return mockMotos;
    } catch (error) {
      console.error('Erro ao carregar motos:', error);
      return mockMotos;
    }
  },

  async addMoto(newMoto: Omit<Moto, 'id'>): Promise<Moto> {
    try {
      if (USE_MOCKS) {
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
      }
      // TODO: Implementar chamada à API quando USE_MOCKS = false
      throw new Error('API não implementada');
    } catch (error) {
      console.error('Erro ao adicionar moto:', error);
      throw new Error('Falha ao adicionar moto');
    }
  },

  async updateMotoStatus(id: string, status: string): Promise<Moto | null> {
    try {
      if (USE_MOCKS) {
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
      }
      // TODO: Implementar chamada à API quando USE_MOCKS = false
      throw new Error('API não implementada');
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
      if (USE_MOCKS) {
        await mockDb.setMotos(mockMotos);
        this.subscribers.forEach(callback => callback(mockMotos));
      }
      // TODO: Implementar reset via API quando USE_MOCKS = false
    } catch (error) {
      console.error('Erro ao resetar storage:', error);
    }
  },
};
