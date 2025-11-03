export type PatioLayout = {
  top: { x: number[]; y: number };
  middle: { x: number[]; y: number };
  bottom: { x: number[]; y: number };
  // opcional: limites para dividir Y em 3 faixas (coordenadas brutas dos mocks)
  yBands?: [number, number]; // [limiteTopMiddle, limiteMiddleBottom]
};

// Layout padrão (equivalente ao parkingSpots atual)
export const defaultLayout: PatioLayout = {
  top: { x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], y: 0 },
  middle: { x: [0, 1, 2, 3, 4, 8, 9, 10, 11, 12], y: 1 },
  bottom: { x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], y: 2 },
};

// Exemplos de layouts específicos por pátio
// IDs conforme mocks: 1 (Paulista), 2 (Consolação), 3 (RJ), 4 (BH)
export const patioLayouts: Record<number, PatioLayout> = {
  1: {
    // Paulista: mantém padrão, mas com bandas de Y otimizadas para posições ~5,10,12
    ...defaultLayout,
    yBands: [7, 11], // <=7 topo, <=11 meio, >11 base
  },
  2: {
    // Consolação: menos vagas na faixa do meio, mais na base
    top: { x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], y: 0 },
    middle: { x: [0, 1, 2, 8, 9, 10], y: 1 },
    bottom: { x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], y: 2 },
    yBands: [9, 11],
  },
  3: {
    // RJ: mais vagas no topo, meio compacto, base moderada
    top: { x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], y: 0 },
    middle: { x: [0, 1, 2, 3, 9, 10, 11, 12], y: 1 },
    bottom: { x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], y: 2 },
    yBands: [8, 12],
  },
  4: {
    // BH: distribuição mais equilibrada nas três faixas
    top: { x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], y: 0 },
    middle: { x: [0, 1, 2, 3, 4, 8, 9, 10, 11], y: 1 },
    bottom: { x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], y: 2 },
    yBands: [7, 11],
  },
  // Outros pátios caem no defaultLayout por enquanto
};

export function getLayoutForPatio(patioId?: number | null): PatioLayout {
  if (!patioId) return defaultLayout;
  return patioLayouts[patioId] ?? defaultLayout;
}
