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