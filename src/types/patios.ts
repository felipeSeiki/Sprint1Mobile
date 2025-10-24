/**
 * Tipos relacionados a médicos
 * Este arquivo contém todas as definições de tipos necessárias para o gerenciamento de médicos
 */

/**
 * Representa um médico no sistema
 * @property id - Identificador único do médico
 * @property name - Nome completo do médico
 * @property specialty - Especialidade médica
 * @property image - URL da foto do médico
 */
export type Patio = {
  id: number;
  endereco: {
    logradouro: string;
    numero: number;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  imagemPlantaUrl: string;
};