import { api } from '../config/api';
import { Patio } from '../types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_PATIO } from '../constants/patio';

const STORAGE_KEYS = {
  PATIO: '@MottuApp:patio'
};

// Interface para o endereço do pátio
interface PatioEndereco {
  logradouro: string;
  numero: number;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

// Interface para criar um novo pátio
interface CreatePatioDTO {
  endereco: PatioEndereco;
  imagemPlantaUrl: string;
}

export const patioService = {
  // Verifica se existe um pátio registrado
  async checkPatioExists(): Promise<boolean> {
    try {
      const patioData = await AsyncStorage.getItem(STORAGE_KEYS.PATIO);
      return !!patioData;
    } catch (error) {
      console.error('Erro ao verificar existência do pátio:', error);
      return false;
    }
  },

  // Obtém o pátio registrado
  async getPatio(): Promise<Patio | null> {
    try {
      const patioData = await AsyncStorage.getItem(STORAGE_KEYS.PATIO);
      if (patioData) {
        return JSON.parse(patioData);
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter pátio:', error);
      return null;
    }
  },

  // Lista todos os pátios (tenta backend, senão fallback para storage)
  async getAllPatios(): Promise<Patio[]> {
    try {
      // tentar backend
      const response = await api.get('/api/patio');
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }
      if (data) return [data];
      return [];
    } catch (error) {
      // fallback para storage - neste app anterior armazenamos somente 1 pátio
      try {
        const patio = await this.getPatio();
        return patio ? [patio] : [];
      } catch (e) {
        console.error('Erro ao listar pátios (fallback):', e);
        return [];
      }
    }
  },

  // Deleta um pátio por id (tenta backend, senão fallback para storage)
  async deletePatioById(id: number): Promise<void> {
    try {
      await api.delete(`/api/patio/${id}`);
      // se sucesso, remover local se igual
      const current = await this.getPatio();
      if (current && Number(current.id) === Number(id)) {
        await AsyncStorage.removeItem(STORAGE_KEYS.PATIO);
      }
    } catch (error) {
      console.warn('Erro ao deletar pátio no backend, tentando fallback:', error);
      // fallback: se o stored patio tem esse id, remove
      const current = await this.getPatio();
      if (current && Number(current.id) === Number(id)) {
        await AsyncStorage.removeItem(STORAGE_KEYS.PATIO);
        return;
      }
      throw new Error('Falha ao deletar pátio');
    }
  },

  // Registra um novo pátio
  async createPatio(data: CreatePatioDTO): Promise<Patio> {
    try {
      const exists = await this.checkPatioExists();
      if (exists) {
        throw new Error('Já existe um pátio registrado no sistema');
      }

      const patioData = {
        ...data,
        id: 1,
        imagemPlantaUrl: data.imagemPlantaUrl || 'https://example.com/default-planta.png'
      };

      await AsyncStorage.setItem(STORAGE_KEYS.PATIO, JSON.stringify(patioData));
      return patioData;
    } catch (error: any) {
      throw new Error('Erro ao registrar pátio');
    }
  },

  // Atualiza um pátio existente
  async updatePatio(id: number, data: Partial<CreatePatioDTO>): Promise<Patio> {
    try {
      const currentPatio = await this.getPatio();
      if (!currentPatio) {
        throw new Error('Pátio não encontrado');
      }

      const updatedPatio = {
        ...currentPatio,
        ...data
      };

      await AsyncStorage.setItem(STORAGE_KEYS.PATIO, JSON.stringify(updatedPatio));
      return updatedPatio;
    } catch (error) {
      console.error('Erro ao atualizar pátio:', error);
      throw new Error('Erro ao atualizar pátio');
    }
  },

  // Atualiza um pátio por id (tenta backend, senão fallback)
  async updatePatioById(id: number, data: Partial<CreatePatioDTO>): Promise<Patio> {
    try {
      const response = await api.put(`/api/patio/${id}`, data);
      const updated = response.data;
      // update local storage if matches
      const current = await this.getPatio();
      if (current && Number(current.id) === Number(id)) {
        await AsyncStorage.setItem(STORAGE_KEYS.PATIO, JSON.stringify(updated));
      }
      return updated;
    } catch (error) {
      // fallback to local update
      return this.updatePatio(id, data);
    }
  },

  // Obtém pátio por id (tenta backend, senão fallback)
  async getPatioById(id: number): Promise<Patio | null> {
    try {
      const response = await api.get(`/api/patio/${id}`);
      return response.data;
    } catch (error) {
      const current = await this.getPatio();
      if (current && Number(current.id) === Number(id)) return current;
      return null;
    }
  },

  // Deleta um pátio
  async deletePatio(id: number): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.PATIO);
    } catch (error) {
      console.error('Erro ao deletar pátio:', error);
      throw new Error('Erro ao deletar pátio');
    }
  }
};