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
    cep: "",
    logradouro: "",
    numero: "",
    cidade: "",
    estado: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.user ||
        !formData.password ||
        !formData.cep ||
        !formData.logradouro ||
        !formData.numero ||
        !formData.cidade ||
        !formData.estado
      ) {
        alert("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      await register({
        user: formData.user,
        password: formData.password,
        cep: formData.cep,
        logradouro: formData.logradouro,
        numero: formData.numero,
        cidade: formData.cidade,
        estado: formData.estado,
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
