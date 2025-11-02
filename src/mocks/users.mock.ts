import { Users } from '../types/auth';

export const MOCK_USERS: Users[] = [
  // Pátio 1 - Av. Paulista
  {
    id: '1',
    user: 'joao.silva',
    password: 'Employee123',
    role: 'USER',
    patioId: 1,
  },
  {
    id: '2',
    user: 'maria.santos',
    password: 'Admin123',
    role: 'ADMIN',
    patioId: 1,
  },

  // Pátio 2 - Rua da Consolação
  {
    id: '3',
    user: 'pedro.oliveira',
    password: 'Employee123',
    role: 'USER',
    patioId: 2,
  },
  {
    id: '4',
    user: 'ana.costa',
    password: 'Admin123',
    role: 'ADMIN',
    patioId: 2,
  },

  // Pátio 3 - Av. Rio Branco (RJ)
  {
    id: '5',
    user: 'carlos.ferreira',
    password: 'Employee123',
    role: 'USER',
    patioId: 3,
  },
  {
    id: '6',
    user: 'lucia.rodrigues',
    password: 'Admin123',
    role: 'ADMIN',
    patioId: 3,
  },

  // Pátio 4 - Av. Getúlio Vargas (BH)
  {
    id: '7',
    user: 'roberto.almeida',
    password: 'Employee123',
    role: 'USER',
    patioId: 4,
  },
  {
    id: '8',
    user: 'fernanda.lima',
    password: 'Admin123',
    role: 'ADMIN',
    patioId: 4,
  },

  // Master user (not linked to specific patio)
  {
    id: '9',
    user: 'master',
    password: 'Master123',
    role: 'MASTER',
  },
];
