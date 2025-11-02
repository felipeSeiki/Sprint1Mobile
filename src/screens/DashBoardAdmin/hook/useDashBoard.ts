import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Patio, RootStackParamList } from "../../../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { patioService } from "../../../services/patioService";

export const useDashBoard = () => {
  const { signOut, user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>("Todas");
  const [showModal, setShowModal] = useState(false);
  const [selectedPatio, setSelectedPatio] = useState<Patio | null>(null);
  const [patios, setPatios] = useState<Patio[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadPatios = async () => {
    try {
      const list = await patioService.getAllPatios();
      let filtered = list;
      if (user && user.role !== 'MASTER') {
        const uidPatioId = (user as any).patioId;
        if (typeof uidPatioId === 'number') {
          filtered = list.filter(p => p.id === uidPatioId);
        }
      }
      setPatios(filtered);
    } catch (error) {
      console.error("Erro ao carregar pátios:", error);
    }
  };

  // Carrega os pátios (mockados quando USE_MOCKS = true)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      await loadPatios();
    })();
    return () => { isMounted = false; };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPatios();
    setRefreshing(false);
  };

  const deletePatio = async (id: number) => {
    try {
      await patioService.deletePatio(id);
      setPatios((prevPatios) => prevPatios.filter((patio) => patio.id !== id));
    } catch (error) {
      console.error("Erro ao deletar pátio:", error);
    }
  };

  const handlePatioPress = (patio: Patio) => {
    setSelectedPatio(patio);
    setShowModal(true);
  };

  const handleLogOut = (
    navigation: NativeStackNavigationProp<RootStackParamList, "Dashboard">
  ) => {
    signOut();
    navigation.navigate("Login");
  };

  return {
    selectedFilter,
    showModal,
    setShowModal,
    selectedPatio,
    patios,
    refreshing,
    onRefresh,
    loadPatios,
    handlePatioPress,
    deletePatio,
  };
};
