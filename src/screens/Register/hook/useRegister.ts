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
    endereco: {
      logradouro: "",
      numero: 0,
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
    imagemPlantaUrl: "",
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
        !formData.endereco.cep ||
        !formData.endereco.logradouro ||
        !formData.endereco.numero ||
        !formData.endereco.cidade ||
        !formData.endereco.estado ||
        !formData.endereco.bairro
      ) {
        alert("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      await register({
        user: formData.user,
        password: formData.password,
        cep: formData.endereco.cep,
        logradouro: formData.endereco.logradouro,
        numero: Number(formData.endereco.numero),
        cidade: formData.endereco.cidade,
        estado: formData.endereco.estado,
        bairro: formData.endereco.bairro,
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
