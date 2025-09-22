import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Moto } from "../../../types/motos";
import { motoService } from "../../../services/auth";
import { RootStackParamList } from "../../../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export const useDashBoard = () => {
  const { signOut } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>("Todas");
  const [showModal, setShowModal] = useState(false);
  const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);
  const [motos, setMotos] = useState<Moto[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const loadMotos = async () => {
      const allMotos = await motoService.getAllMotos();
      setMotos(allMotos);
    };

    unsubscribe = motoService.subscribe((newMotos) => {
      setMotos(newMotos);
    });

    loadMotos();

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

  return {
    selectedFilter,
    showModal,
    setShowModal,
    selectedMoto,
    motos,
    handleMotoPress,
    handleLogOut,
  };
};
