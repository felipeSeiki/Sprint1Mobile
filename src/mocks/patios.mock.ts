import { Patio } from '../types/patios';

export const MOCK_PATIOS: Patio[] = [
  {
    id: 1,
    endereco: {
      logradouro: 'Av. Paulista',
      numero: 1000,
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-100',
    },
    imagemPlantaUrl: 'https://example.com/patio-sp.png',
  },
  {
    id: 2,
    endereco: {
      logradouro: 'Rua da Consolação',
      numero: 2500,
      bairro: 'Consolação',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01301-100',
    },
    imagemPlantaUrl: 'https://example.com/patio-consolacao.png',
  },
  {
    id: 3,
    endereco: {
      logradouro: 'Av. Rio Branco',
      numero: 156,
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '20040-901',
    },
    imagemPlantaUrl: 'https://example.com/patio-rj.png',
  },
  {
    id: 4,
    endereco: {
      logradouro: 'Av. Getúlio Vargas',
      numero: 1500,
      bairro: 'Funcionários',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      cep: '30112-020',
    },
    imagemPlantaUrl: 'https://example.com/patio-bh.png',
  },
];
