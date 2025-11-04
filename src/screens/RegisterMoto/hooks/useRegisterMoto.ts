import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { motoService } from "../../../services/motoService";
import { RegisterMotosScreenNavigationProp } from "../type/types";
import { useState } from "react";

export const useRegisterMoto = () => {
  const { signOut, user } = useAuth();

  const validStatuses = ['Disponível', 'Manutenção', 'Reservada'];

  const availableSpots = {
    top: { x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], y: 0 },
    middle: { x: [0, 1, 2, 3, 4, 8, 9, 10, 11, 12], y: 1 },
    bottom: { x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], y: 2 },
  };
  const getRandomPosition = async () => {
    const existingMotos = await motoService.getAllMotos();

    const allPositions: Array<{ x: number; y: number }> = [];

    Object.entries(availableSpots).forEach(([_, value]) => {
      value.x.forEach((x) => {
        allPositions.push({ x, y: value.y });
      });
    });

    const availablePositions = allPositions.filter(
      (pos) =>
        !existingMotos.some(
          (moto) =>
            moto.posicaoX === String(pos.x) && moto.posicaoY === String(pos.y)
        )
    );

    if (availablePositions.length === 0) {
      throw new Error("Não há posições disponíveis no pátio");
    }

    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[randomIndex];
  };

  const [formData, setFormData] = useState({
    modelo: "",
    placa: "",
    codigoTag: "",
    status: "",
    posicaoX: "",
    posicaoY: "",
  });

  const navigation = useNavigation<RegisterMotosScreenNavigationProp>();

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.modelo) errors.push("Modelo é obrigatório");
    if (!formData.placa) errors.push("Placa é obrigatória");
    if (!formData.codigoTag) errors.push("Código Tag é obrigatório");
    if (!formData.status) errors.push("Status é obrigatório");

    // Validar formato da placa (ABC1234)
    const placaRegex = /^[A-Z]{3}[0-9]{4}$/;
    if (!placaRegex.test(formData.placa)) {
      errors.push("Formato de placa inválido. Use o formato ABC1234");
    }

    // Validar status
    if (!validStatuses.includes(formData.status)) {
      errors.push(
        `Status inválido. Use um dos seguintes: ${validStatuses.join(", ")}`
      );
    }

    return errors;
  };

  const handleSubmit = async () => {
    try {
      const errors = validateForm();
      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }

      const position = await getRandomPosition();

      const newMoto = {
        modelo: formData.modelo,
        placa: formData.placa.toUpperCase(),
        cod_tag: formData.codigoTag,
        status: formData.status,
        posicaoX: String(position.x),
        posicaoY: String(position.y),
        patioId: user?.patioId || undefined, // Associa a moto ao pátio do usuário
      };

      const addedMoto = await motoService.addMoto(newMoto);

      if (addedMoto) {
        alert("Moto cadastrada com sucesso!");
        navigation.navigate("Home");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao cadastrar moto";
      alert(errorMessage);
    }
  };

  const handleLogOut = () => {
    signOut();
    navigation.navigate("Login");
  };

  return {
    navigation,
    formData,
    handleChange,
    handleSubmit,
    handleLogOut,
    validStatuses,
  };
};
