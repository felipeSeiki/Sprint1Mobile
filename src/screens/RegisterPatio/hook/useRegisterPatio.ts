import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { RegisterDataPatio } from "../../../types/auth";
import { Alert } from "react-native";
import { usePatio } from "../../../hooks/usePatio";
import { patioService } from '../../../services/patioService';
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from '../../../types/navigation';

type RegisterPatioRouteProp = RouteProp<RootStackParamList, 'RegisterPatio'>;

export const useRegisterPatio = () => {
  const { user } = useAuth();
  const { registerPatio, checkPatioExists } = usePatio();
  const navigation = useNavigation();
  const route = useRoute<RegisterPatioRouteProp>();
  const editingPatio = (route?.params as any)?.patio;
  const editingPatioId = editingPatio?.id;
  const [isPatioRegistered, setIsPatioRegistered] = useState(false);
  
  useEffect(() => {
    checkPatioAccess();
  }, []);

  const checkPatioAccess = async () => {
    try {
      // Verifica se o usuário é admin ou master (master pode editar)
      if (user?.role !== "ADMIN" && user?.role !== 'MASTER') {
        Alert.alert("Acesso Negado", "Apenas administradores ou master podem acessar este recurso.");
        navigation.goBack();
        return;
      }

      // Se estivermos criando (não editando), verifica se já existe um pátio registrado
      if (!editingPatioId) {
        const patioExists = await checkPatioExists();
        if (patioExists) {
          Alert.alert("Aviso", "Já existe um pátio registrado no sistema.");
          setIsPatioRegistered(true);
          navigation.goBack();
          return;
        }
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

  // se vier patio por params, preencher para edição
  useEffect(() => {
    if (editingPatio) {
      setFormData({
        endereco: {
          cep: String(editingPatio.endereco?.cep || ''),
          logradouro: editingPatio.endereco?.logradouro || '',
          numero: String(editingPatio.endereco?.numero || ''),
          cidade: editingPatio.endereco?.cidade || '',
          estado: editingPatio.endereco?.estado || '',
          bairro: editingPatio.endereco?.bairro || '',
        },
        imagemPlantaUrl: editingPatio.imagemPlantaUrl || ''
      });
    }
  }, [editingPatio]);

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

      if (editingPatioId) {
        // editar
        try {
          const updated = await patioService.updatePatioById(editingPatioId, data as any);
          Alert.alert('Sucesso', 'Pátio atualizado com sucesso!');
          navigation.goBack();
          return;
        } catch (e) {
          console.warn('Erro ao atualizar pátio', e);
          Alert.alert('Erro', 'Não foi possível atualizar o pátio');
          return;
        }
      }

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
