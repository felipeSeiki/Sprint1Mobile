import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Moto } from "../../../types/motos";
import { motoService } from "../../../services/auth";
import { Patio, RootStackParamList } from "../../../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { patioService } from "../../../services/patioService";
import { useFocusEffect } from "@react-navigation/native";

export const useDashBoard = () => {
  const { user, signOut } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>("Todas");
  const [showModal, setShowModal] = useState(false);
  const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);
  const [motos, setMotos] = useState<Moto[]>([]);
  const [patios, setPatios] = useState<Patio[]>([]);
  const [filterPatioId, setFilterPatioId] = useState<string | number>("Todos");
  const [filterStatus, setFilterStatus] = useState<string>("Todas");
  const [filterPlate, setFilterPlate] = useState<string>("");

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const loadMotos = async () => {
      const allMotos = await motoService.getAllMotos();
      setMotos(allMotos);
    };

    const loadPatios = async () => {
      const list = await patioService.getAllPatios();
      setPatios(list);
    };

    unsubscribe = motoService.subscribe((newMotos) => {
      setMotos(newMotos);
    });

    loadMotos();
    loadPatios();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleMotoPress = (moto: Moto) => {
    setSelectedMoto(moto);
    setShowModal(true);
  };

  const handleLogOut = (
    navigation: NativeStackNavigationProp<RootStackParamList, "Dashboard">
  ) => {
    signOut();
    navigation.navigate("Login");
  };

  const statusOptions = useMemo(() => {
    const set = new Set<string>(motos.map(m => m.status).filter(Boolean));
    return ["Todas", ...Array.from(set)];
  }, [motos]);

  const patioOptions = useMemo(() => {
    // USER/ADMIN veem apenas seu pátio; MASTER vê todos
    const filtered = (user?.role === 'MASTER' || !user?.patioId)
      ? patios
      : patios.filter(p => p.id === user.patioId);

    // identificar cidades com múltiplas unidades
    const cityCounts = new Map<string, { cidade: string; estado: string; count: number }>();
    filtered.forEach(p => {
      const key = `${p.endereco.cidade}|${p.endereco.estado}`;
      const cur = cityCounts.get(key) || { cidade: p.endereco.cidade, estado: p.endereco.estado, count: 0 };
      cur.count += 1;
      cityCounts.set(key, cur);
    });

    const groupOptions = Array.from(cityCounts.values())
      .filter(entry => entry.count > 1)
      .map(entry => ({ id: `CITY|${entry.cidade}|${entry.estado}`, label: `${entry.cidade}/${entry.estado} (todos)` }));

    const individualOptions = filtered.map(p => ({
      id: p.id as number,
      label: `${p.endereco.logradouro}, ${p.endereco.numero} - ${p.endereco.cidade}/${p.endereco.estado}`,
    }));

    // Se USER/ADMIN: não mostrar "Todos os pátios" (têm apenas 1)
    const showTodos = (user?.role === 'MASTER' || !user?.patioId);
    return [
      ...(showTodos ? [{ id: 'Todos' as const, label: 'Todos os pátios' }] : []),
      ...groupOptions,
      ...individualOptions,
    ];
  }, [patios, user]);

  const filteredMotos = useMemo(() => {
    return motos.filter(m => {
      // USER/ADMIN veem apenas motos do seu pátio
      if (user?.role !== 'MASTER' && user?.patioId) {
        if (m.patioId !== user.patioId) return false;
      }

      let matchesPatio = true;
      if (filterPatioId !== 'Todos') {
        if (typeof filterPatioId === 'string' && filterPatioId.startsWith('CITY|')) {
          const [, cidade, estado] = filterPatioId.split('|');
          const allowedIds = patios
            .filter(p => p.endereco.cidade === cidade && p.endereco.estado === estado)
            .map(p => p.id);
          matchesPatio = m.patioId != null ? allowedIds.includes(m.patioId as number) : false;
        } else {
          matchesPatio = m.patioId === filterPatioId;
        }
      }

      const matchesStatus = filterStatus === 'Todas' ? true : (m.status === filterStatus);
      const matchesPlate = filterPlate.trim() === '' ? true : m.placa.toLowerCase().includes(filterPlate.trim().toLowerCase());
      return matchesPatio && matchesStatus && matchesPlate;
    });
  }, [motos, filterPatioId, filterStatus, filterPlate, patios, user]);

  // Resetar filtros ao sair da aba/tela
  useFocusEffect(
    useCallback(() => {
      return () => {
        setFilterPatioId('Todos');
        setFilterStatus('Todas');
        setFilterPlate('');
      };
    }, [])
  );

  return {
    user,
    showModal,
    setShowModal,
    selectedMoto,
    motos: filteredMotos,
    handleMotoPress,
    handleLogOut,
    // filters
    patios,
    patioOptions,
    statusOptions,
    filterPatioId,
    setFilterPatioId,
    filterStatus,
    setFilterStatus,
    filterPlate,
    setFilterPlate,
  };
};
