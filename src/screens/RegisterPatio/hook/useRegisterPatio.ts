import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { RegisterDataPatio } from "../../../types/auth";
import { Alert } from "react-native";
import { usePatio } from "../../../hooks/usePatio";
import { useNavigation } from "@react-navigation/native";

export const useRegisterPatio = () => {
  const { user } = useAuth();
  const { registerPatio, checkPatioExists } = usePatio();
  const navigation = useNavigation();
  const [isPatioRegistered, setIsPatioRegistered] = useState(false);
  
  useEffect(() => {
    checkPatioAccess();
  }, []);

  const checkPatioAccess = async () => {
    try {
      // Verifica se o usuário é admin
      if (user?.role !== "ADMIN") {
        Alert.alert("Acesso Negado", "Apenas administradores podem registrar um pátio.");
        navigation.goBack();
        return;
      }

      // Verifica se já existe um pátio registrado
      const patioExists = await checkPatioExists();
      if (patioExists) {
        Alert.alert("Aviso", "Já existe um pátio registrado no sistema.");
        setIsPatioRegistered(true);
        navigation.goBack();
        return;
      }
    } catch (error) {
      console.error("Erro ao verificar acesso:", error);
      Alert.alert("Erro", "Erro ao verificar permissões de acesso.");
      navigation.goBack();
    }
  };
  const [formData, setFormData] = useState({
    endereco: {
      cep: "",
      logradouro: "",
      numero: "",
      cidade: "",
      estado: "",
      bairro: "",
    },
    imagemPlantaUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        Alert.alert("Erro", "Usuário não encontrado.");
        return;
      }

      const data: RegisterDataPatio = {
        endereco: {
          cep: formData.endereco.cep,
          logradouro: formData.endereco.logradouro,
          numero: Number(formData.endereco.numero),
          cidade: formData.endereco.cidade,
          estado: formData.endereco.estado,
          bairro: formData.endereco.bairro,
        },
        imagemPlantaUrl: formData.imagemPlantaUrl,
      };

      await registerPatio(data);
      Alert.alert("Sucesso", "Pátio registrado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Erro ao registrar o pátio. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    registerPatio,
    formData,
    setFormData,
    loading,
    handleSubmit,
    isPatioRegistered
  };
};
