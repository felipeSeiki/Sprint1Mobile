import { Alert } from "react-native";
import { Users } from "../../../types/auth";
import { usersService } from "../../../services/usersService";
import { patioService } from "../../../services/patioService";
import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { EditUsersRouteProp } from "../type/type";
import { useAuth } from "../../../contexts/AuthContext";

export const useEditUsers = () => {
  const route = useRoute<EditUsersRouteProp>();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { patioId } = route.params;
  const [users, setUsers] = useState<Users[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editingUser, setEditingUser] = useState<Users | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    user: "",
    password: "",
  });
  const [createData, setCreateData] = useState({
    user: "",
    password: "",
    role: "USER" as Users["role"],
  });

  const [patioTitle, setPatioTitle] = useState<string>("");

  // Verificação de acesso - MASTER e ADMIN podem gerenciar usuários
  useEffect(() => {
    if (user?.role !== "MASTER" && user?.role !== "ADMIN") {
      Alert.alert(
        "Acesso Negado",
        "Apenas Master ou Admin podem gerenciar usuários do pátio.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }
  }, [user, navigation]);

  const loadUsers = async () => {
    const patioUsers = await usersService.listByPatio(patioId);
    setUsers(patioUsers);
  };

  useEffect(() => {
    (async () => {
      await loadUsers();
      const patio = await patioService.getPatioById(patioId);
      if (patio)
        setPatioTitle(`${patio.endereco.cidade}/${patio.endereco.estado}`);
    })();
  }, [patioId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
    setRefreshing(false);
  };

  const handleEditUser = (user: Users) => {
    setEditingUser(user);
    setFormData({
      user: user.user,
      password: user.password,
    });
    setShowModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Deseja realmente excluir este usuário?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            (async () => {
              await usersService.remove(userId);
              await loadUsers();
              Alert.alert("Sucesso", "Usuário excluído");
            })();
          },
        },
      ]
    );
  };

  const handleSaveUser = () => {
    if (!editingUser) return;

    (async () => {
      await usersService.update(editingUser.id!, {
        user: formData.user,
        password: formData.password,
      });
      await loadUsers();
      setShowModal(false);
      Alert.alert("Sucesso", "Usuário atualizado");
    })();
  };

  const handleOpenCreate = () => {
    setCreateData({ user: "", password: "", role: "USER" });
    setShowCreateModal(true);
  };

  const handleCreateUser = () => {
    (async () => {
      await usersService.create({
        user: createData.user,
        password: createData.password,
        role: createData.role,
        patioId: patioId,
      } as Users);
      await loadUsers();
      setShowCreateModal(false);
      Alert.alert(
        "Sucesso",
        "Usuário criado (sessão atual, não persiste no dispositivo)."
      );
    })();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ user: "", password: "" });
  };

  return {
    user,
    users,
    refreshing,
    onRefresh,
    patioTitle,
    showModal,
    formData,
    setFormData,
    handleEditUser,
    handleDeleteUser,
    handleSaveUser,
    showCreateModal,
    createData,
    setCreateData,
    handleOpenCreate,
    handleCreateUser,
    handleCloseModal,
    setShowCreateModal,
  };
};
