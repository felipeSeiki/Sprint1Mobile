import { Patio } from '../types/auth';

export const DEFAULT_PATIO: Patio = {
  id: 1,
  endereco: {
    cep: "01153-000",
    logradouro: "Avenida Principal",
    numero: 1000,
    cidade: "São Paulo",
    estado: "SP",
    bairro: "Centro"
  },
  imagemPlantaUrl: "https://example.com/planta.jpg"
};