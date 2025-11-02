import React, { useEffect, useState } from 'react';
import { ScrollView, View, RefreshControl, Modal, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { MOCK_USERS } from '../../mocks/users.mock';
import { MOCK_PATIOS } from '../../mocks/patios.mock';
import { Users } from '../../types/auth';
import { Input, Button } from 'react-native-elements';
import {
  Container,
  Content,
  Title,
  TableContainer,
  TableHeader,
  HeaderText,
  TableRow,
  RowText,
  ActionButton,
  ActionButtonText,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  CloseButton,
  CloseText,
  ModalBody,
} from './styles';

type EditUsersRouteProp = RouteProp<RootStackParamList, 'EditUsers'>;

export const EditUsersScreen: React.FC = () => {
  const route = useRoute<EditUsersRouteProp>();
  const navigation = useNavigation();
  const { patioId } = route.params;
  const [users, setUsers] = useState<Users[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editingUser, setEditingUser] = useState<Users | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    user: '',
    password: '',
  });

  const patio = MOCK_PATIOS.find(p => p.id === patioId);

  const loadUsers = () => {
    const patioUsers = MOCK_USERS.filter(u => (u as any).patioId === patioId);
    setUsers(patioUsers);
  };

  useEffect(() => {
    loadUsers();
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
      'Confirmar Exclusão',
      'Deseja realmente excluir este usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setUsers(prev => prev.filter(u => u.id !== userId));
            Alert.alert('Sucesso', 'Usuário excluído (mock)');
          },
        },
      ]
    );
  };

  const handleSaveUser = () => {
    if (!editingUser) return;

    setUsers(prev =>
      prev.map(u =>
        u.id === editingUser.id
          ? { ...u, user: formData.user, password: formData.password }
          : u
      )
    );
    setShowModal(false);
    Alert.alert('Sucesso', 'Usuário atualizado (mock)');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ user: '', password: '' });
  };

  return (
    <Container>
      <Content>
        <Title>
          Usuários do Pátio: {patio?.endereco.cidade}/{patio?.endereco.estado}
        </Title>

        <TableContainer>
          <TableHeader>
            <HeaderText style={{ flex: 0.5 }}>ID</HeaderText>
            <HeaderText style={{ flex: 1.5 }}>Nome de Usuário</HeaderText>
            <HeaderText style={{ flex: 1 }}>Função</HeaderText>
            <HeaderText style={{ flex: 1 }}>Ações</HeaderText>
          </TableHeader>

          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#00CF3A"
              />
            }
          >
            {users.length === 0 ? (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <RowText>Nenhum usuário encontrado</RowText>
              </View>
            ) : (
              users.map((user, idx) => (
                <TableRow key={user.id} style={{ backgroundColor: idx % 2 === 0 ? '#262626' : '#2A2A2A' }}>
                  <RowText style={{ flex: 0.5 }}>{user.id}</RowText>
                  <RowText style={{ flex: 1.5 }}>{user.user}</RowText>
                  <RowText style={{ flex: 1 }}>{user.role}</RowText>
                  <View style={{ flex: 1, flexDirection: 'row', gap: 8 }}>
                    <ActionButton onPress={() => handleEditUser(user)}>
                      <ActionButtonText>✎</ActionButtonText>
                    </ActionButton>
                    <ActionButton
                      onPress={() => handleDeleteUser(user.id || '')}
                      style={{ backgroundColor: '#FF4D4F' }}
                    >
                      <ActionButtonText>✕</ActionButtonText>
                    </ActionButton>
                  </View>
                </TableRow>
              ))
            )}
          </ScrollView>
        </TableContainer>
      </Content>

      <Modal visible={showModal} transparent animationType="fade" onRequestClose={handleCloseModal}>
        <ModalOverlay>
          <ModalContent>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <ModalTitle>Editar Usuário</ModalTitle>
              <CloseButton onPress={handleCloseModal}>
                <CloseText>✕</CloseText>
              </CloseButton>
            </View>
            <ModalBody>
              <Input
                placeholder="Nome de Usuário"
                value={formData.user}
                onChangeText={(text) => setFormData(prev => ({ ...prev, user: text }))}
                inputStyle={{ color: '#FFFFFF' }}
              />
              <Input
                placeholder="Senha"
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                secureTextEntry
                inputStyle={{ color: '#FFFFFF' }}
              />
              <Button title="Salvar" onPress={handleSaveUser} buttonStyle={{ backgroundColor: '#00CF3A', marginTop: 12 }} />
              <Button title="Cancelar" onPress={handleCloseModal} type="outline" buttonStyle={{ marginTop: 8, borderColor: '#00CF3A' }} titleStyle={{ color: '#00CF3A' }} />
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
};
