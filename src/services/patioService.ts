import { api } from '../config/api';
import { Patio } from '../types/auth';

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
      const response = await api.get('/api/patio/exists');
      return response.data.exists;
    } catch (error) {
      console.error('Erro ao verificar existência do pátio:', error);
      return false;
    }
  },

  // Obtém o pátio registrado
  async getPatio(): Promise<Patio | null> {
    try {
      const response = await api.get('/api/patio');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter pátio:', error);
      return null;
    }
  },

  // Registra um novo pátio
  async createPatio(data: CreatePatioDTO): Promise<Patio> {
    // Adiciona uma URL de imagem fixa para a planta
    const patioData = {
      ...data,
      imagemPlantaUrl: data.imagemPlantaUrl || 'https://example.com/default-planta.png'
    };

    try {
      const response = await api.post('/api/patio', patioData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('Já existe um pátio registrado no sistema');
      }
      throw new Error('Erro ao registrar pátio');
    }
  },

  // Atualiza um pátio existente
  async updatePatio(id: number, data: Partial<CreatePatioDTO>): Promise<Patio> {
    try {
      const response = await api.put(`/api/patio/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar pátio:', error);
      throw new Error('Erro ao atualizar pátio');
    }
  },

  // Deleta um pátio
  async deletePatio(id: number): Promise<void> {
    try {
      await api.delete(`/api/patio/${id}`);
    } catch (error) {
      console.error('Erro ao deletar pátio:', error);
      throw new Error('Erro ao deletar pátio');
    }
  }
};