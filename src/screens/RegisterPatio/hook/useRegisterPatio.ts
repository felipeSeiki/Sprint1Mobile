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
  const editingPatioId = (route?.params as any)?.patioId as number | undefined;
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

  // se vier patioId por params, carregar e preencher para edição
  useEffect(() => {
    const loadPatio = async () => {
      if (editingPatioId) {
        try {
          const patio = await patioService.getPatioById(editingPatioId);
          if (patio) {
            setFormData({
              endereco: {
                cep: String(patio.endereco?.cep || ''),
                logradouro: patio.endereco?.logradouro || '',
                numero: String(patio.endereco?.numero || ''),
                cidade: patio.endereco?.cidade || '',
                estado: patio.endereco?.estado || '',
                bairro: patio.endereco?.bairro || '',
              },
              imagemPlantaUrl: patio.imagemPlantaUrl || ''
            });
          }
        } catch (e) {
          console.warn('Erro ao carregar pátio para edição', e);
        }
      }
    };
    loadPatio();
  }, [editingPatioId]);

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
