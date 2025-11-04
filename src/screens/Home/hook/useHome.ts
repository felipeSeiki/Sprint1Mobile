import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Moto } from "../../../types/motos";
import { useAuth } from "../../../contexts/AuthContext";
import { motoService } from "../../../services/motoService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Patio, RootStackParamList } from "../../../types";
import { patioService } from "../../../services/patioService";
import { getLayoutForPatio, PatioLayout } from "../models/patioLayouts";
import { mockDb } from "../../../services/mockDb";
import { useFocusEffect } from "@react-navigation/native";

export const useHome = () => {
    const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const [motos, setMotos] = useState<Moto[]>([]);
  const [patios, setPatios] = useState<Patio[]>([]);
  const [selectedPatioId, setSelectedPatioId] = useState<number | null>(null);
      const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);
      const [showModal, setShowModal] = useState(false);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const { signOut, user } = useAuth();
    
      // Pan/zoom removidos para experiência fixa sem scroll/pan
    
      // Carrega dados iniciais
      useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        let isMounted = true;
    
        const loadMotos = async () => {
          try {
            const allMotos = await motoService.getAllMotos();
            if (isMounted) {
              setMotos(allMotos);
            }
          } catch (err) {
            console.error('Erro ao carregar motos:', err);
            if (isMounted) {
              setError('Erro ao carregar motos');
            }
          }
        };

        const loadPatios = async () => {
          try {
            // Garante que o mockDb está inicializado
            await mockDb.init();
            const list = await patioService.getAllPatios();
            if (isMounted) {
              // USER/ADMIN veem apenas seu pátio; MASTER vê todos
              const filtered = (user?.role === 'MASTER' || !user?.patioId)
                ? list
                : list.filter(p => p.id === user.patioId);
              setPatios(filtered);
              if (filtered && filtered.length > 0) {
                // selecionar primeiro pátio por padrão
                setSelectedPatioId(filtered[0].id);
              }
            }
          } catch (err) {
            console.error('Erro ao carregar pátios:', err);
            if (isMounted) {
              setError('Erro ao carregar pátios');
            }
          } finally {
            if (isMounted) {
              setLoading(false);
            }
          }
        };
    
        unsubscribe = motoService.subscribe((newMotos) => {
          if (isMounted) {
            setMotos(newMotos);
          }
        });
    
        setLoading(true);
        setError(null);
        loadMotos();
        loadPatios();
    
        return () => {
          isMounted = false;
          if (unsubscribe) unsubscribe();
        };
      }, [user]);

      // Recarrega motos quando a tela recebe foco (ex: voltar do cadastro)
      useFocusEffect(
        useCallback(() => {
          const refreshMotos = async () => {
            try {
              const allMotos = await motoService.getAllMotos();
              setMotos(allMotos);
            } catch (err) {
              console.error('Erro ao recarregar motos:', err);
            }
          };
          refreshMotos();
        }, [])
      );
    
      const handleMotoPress = (moto: Moto) => {
        setSelectedMoto(moto);
        setShowModal(true);
      };
    
    
      const handleLogOut = (navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>) => {
        signOut();
        navigation.navigate('Login')
      };
    
      const getSpotColor = (moto: Moto | undefined) => {
        if (!moto) return '#2A2A2A';
        switch (moto.status) {
          case 'Disponível':
            return '#00CF3A';
          case 'Manutenção':
            return '#FF0000';
          default:
            return '#FFAA00';
        }
      };

      const patioOptions = useMemo(() => {
        return patios.map(p => ({ id: p.id, label: `${p.endereco.logradouro}, ${p.endereco.numero} - ${p.endereco.cidade}/${p.endereco.estado}` }));
      }, [patios]);

      const filteredMotos = useMemo(() => {
        if (!selectedPatioId) return motos;
        return motos.filter(m => m.patioId === selectedPatioId);
      }, [motos, selectedPatioId]);

      // Layout atual do pátio selecionado (ou default)
      const layout: PatioLayout = useMemo(() => {
        return getLayoutForPatio(selectedPatioId ?? undefined);
      }, [selectedPatioId]);

      // Mapeia motos para o grid preservando distribuição de posições dos mocks
      const assignedByCoord = useMemo(() => {
        const map = new Map<string, Moto>();
        const valid = filteredMotos
          .map(m => ({ m, x: Number(m.posicaoX), y: Number(m.posicaoY) }))
          .filter(v => !isNaN(v.x) && !isNaN(v.y));

        if (valid.length === 0) return map;

        // Faixas de X/Y do conjunto atual
        const xs = valid.map(v => v.x);
        const ys = valid.map(v => v.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const rangeX = maxX - minX || 1; // evita div/0
        const rangeY = maxY - minY || 1;

        const rowDefs = [
          { y: layout.top.y, xs: layout.top.x },
          { y: layout.middle.y, xs: layout.middle.x },
          { y: layout.bottom.y, xs: layout.bottom.x },
        ];

        // Bandas de Y: usa layout.yBands se houver; senão tercis sobre os dados
        let y1: number;
        let y2: number;
        if (layout.yBands) {
          [y1, y2] = layout.yBands;
        } else {
          const sortedY = [...ys].sort((a, b) => a - b);
          const q1Idx = Math.floor(sortedY.length / 3);
          const q2Idx = Math.floor((2 * sortedY.length) / 3);
          y1 = sortedY[q1Idx] ?? (minY + rangeY / 3);
          y2 = sortedY[q2Idx] ?? (minY + (2 * rangeY) / 3);
        }

        valid.forEach(v => {
          // Determina a linha por percentil de Y
          let row = 0;
          if (v.y <= y1) row = 0; else if (v.y <= y2) row = 1; else row = 2;
          const rowX = rowDefs[row].xs;
          const rowY = rowDefs[row].y;

          // Mapeia X proporcionalmente ao número de slots da linha
          const fx = (v.x - minX) / rangeX; // 0..1
          const idxFloat = fx * (rowX.length - 1);
          const idx = Math.round(idxFloat);
          const gridX = rowX[Math.max(0, Math.min(rowX.length - 1, idx))];
          const key = `${gridX}-${rowY}`;

          if (!map.has(key)) {
            map.set(key, v.m);
          } else {
            // Critério de desempate: escolhe quem está mais próximo do centro do slot (idx)
            const current = map.get(key)!;
            const currentX = Number(current.posicaoX);
            const currentFx = (currentX - minX) / rangeX;
            const currentIdxFloat = currentFx * (rowX.length - 1);
            const curDist = Math.abs(currentIdxFloat - idx);
            const newDist = Math.abs(idxFloat - idx);
            if (newDist < curDist) {
              map.set(key, v.m);
            }
          }
        });

        return map;
      }, [filteredMotos, layout]);

      const layoutCapacity = useMemo(() => {
        return layout.top.x.length + layout.middle.x.length + layout.bottom.x.length;
      }, [layout]);

      const occupancy = useMemo(() => {
        return assignedByCoord.size;
      }, [assignedByCoord]);

      const motoAt = (x: number, y: number): Moto | undefined => assignedByCoord.get(`${x}-${y}`);

      const reloadData = async () => {
        setLoading(true);
        setError(null);
        try {
          // Garante que o mockDb está inicializado
          await mockDb.init();
          
          const allMotos = await motoService.getAllMotos();
          setMotos(allMotos);
          
          const list = await patioService.getAllPatios();
          const filtered = (user?.role === 'MASTER' || !user?.patioId)
            ? list
            : list.filter(p => p.id === user.patioId);
          setPatios(filtered);
          if (filtered && filtered.length > 0) {
            setSelectedPatioId(filtered[0].id);
          }
        } catch (err) {
          console.error('Erro ao recarregar dados:', err);
          setError('Erro ao recarregar dados');
        } finally {
          setLoading(false);
        }
      };
    
      return {
        selectedFilter,
        setSelectedFilter,
        motos: filteredMotos,
        selectedMoto,
        showModal,
        setShowModal,
        handleMotoPress,
        handleLogOut,
        getSpotColor,
        patios,
        selectedPatioId,
        setSelectedPatioId,
        patioOptions,
        motoAt,
        layout,
        layoutCapacity,
        occupancy,
        loading,
        error,
        reloadData,
      }
}