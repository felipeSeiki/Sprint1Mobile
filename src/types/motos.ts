/**
 * Tipos relacionados a motos
 * Este arquivo contém todas as definições de tipos necessárias para o gerenciamento de motos
 */

/**
 * Representa uma moto no sistema
 * @property id - Identificador único da moto
 * @property modelo - Modelo da moto
 * @property placa - Placa da moto
 * @property cod_tag - Código da tag RFID
 * @property status - Status da moto (Disponível, Manutenção, Reservada)
 * @property posicaoX - Posição X no pátio
 * @property posicaoY - Posição Y no pátio
 * @property patioId - ID do pátio onde a moto está estacionada (opcional para mocks)
 */
export type Moto = {
  id: string;
  modelo: string;
  placa: string;
  cod_tag: string;
  status: string;
  posicaoX: string;
  posicaoY: string;
  patioId?: number;
};