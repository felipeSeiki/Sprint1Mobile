import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Patio, RootStackParamList } from "../../../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { patioService } from "../../../services/patioService";

export const useDashBoard = () => {
  const { signOut } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>("Todas");
  const [showModal, setShowModal] = useState(false);
  const [selectedPatio, setSelectedPatio] = useState<Patio | null>(null);
  const [patios, setPatios] = useState<Patio[]>([]);

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
    handlePatioPress,
    deletePatio,
  };
};
