import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { useState } from "react";
import { RegisterScreenNavigationProp } from "../type/type";

export const useRegister = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    user: "",
    password: "",
  });

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

      await register({
        user: formData.user,
        password: formData.password
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
