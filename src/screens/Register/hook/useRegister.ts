import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { RegisterScreenNavigationProp } from "../type/type";
import { RootStackParamList } from '../../../types/navigation';

type RegisterRouteProp = RouteProp<RootStackParamList, 'Register'>;

export const useRegister = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    user: "",
    password: "",
  });

  const route = useRoute<RegisterRouteProp>();

  useEffect(() => {
    // se vier prefill por params (role, patioId), podemos pré-configurar campos
    if (route?.params) {
      const params: any = route.params as any;
      if (params.prefillUser) {
        setFormData((prev) => ({ ...prev, user: params.prefillUser }));
      }
    }
  }, [route?.params]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.user || !formData.password) {
        alert("Por favor, preencha usuário e senha");
        return;
      }

      if (formData.password.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres");
        return;
      }

      // Se a rota enviou role/patioId, encaminhar para o serviço
      const params: any = (route && (route.params as any)) || {};
      await register({
        user: formData.user,
        password: formData.password,
        role: params.role,
        patioId: params.patioId
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      alert("Erro ao realizar cadastro: " + errorMessage);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    navigation,
  };
};
