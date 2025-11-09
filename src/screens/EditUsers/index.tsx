import React from 'react';
import { ScrollView, View, RefreshControl, Modal, Alert, Text, TouchableOpacity } from 'react-native';
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
  HeaderContainer,
  TitleContainer,
  AddButtonContainer,
  AddButton,
  AddButtonText,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  CloseButton,
  CloseText,
  ModalBody,
} from './styles';
import { useEditUsers } from './hooks/useEditUsers';

export const EditUsersScreen: React.FC = () => {

  const {
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
    setShowCreateModal
  } = useEditUsers();
  
  // Bloquear renderização se não for MASTER
  if (user?.role !== 'MASTER' && user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <Container>
      <Content>
        <HeaderContainer>
          <TitleContainer>
            <Title>
              Usuários do Pátio: {patioTitle}
            </Title>
          </TitleContainer>
          <AddButtonContainer>
            <AddButton onPress={handleOpenCreate}>
              <AddButtonText>+ Adicionar Usuário</AddButtonText>
            </AddButton>
          </AddButtonContainer>
        </HeaderContainer>

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

      {/* Modal de criação (não persiste no AsyncStorage) */}
      <Modal visible={showCreateModal} transparent animationType="fade" onRequestClose={() => setShowCreateModal(false)}>
        <ModalOverlay>
          <ModalContent>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <ModalTitle>Novo Usuário</ModalTitle>
              <CloseButton onPress={() => setShowCreateModal(false)}>
                <CloseText>✕</CloseText>
              </CloseButton>
            </View>
            <ModalBody>
              <Input
                placeholder="Nome de Usuário"
                value={createData.user}
                onChangeText={(text) => setCreateData(prev => ({ ...prev, user: text }))}
                inputStyle={{ color: '#FFFFFF' }}
              />
              <Input
                placeholder="Senha"
                value={createData.password}
                onChangeText={(text) => setCreateData(prev => ({ ...prev, password: text }))}
                secureTextEntry
                inputStyle={{ color: '#FFFFFF' }}
              />

              {/* Seletor simples de role */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <Text style={{ color: '#fff', marginRight: 8 }}>Perfil:</Text>
                {(['USER','ADMIN'] as Users['role'][]).map(r => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setCreateData(prev => ({ ...prev, role: r }))}
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: '#00CF3A',
                      marginRight: 8,
                      backgroundColor: createData.role === r ? '#00CF3A' : 'transparent',
                    }}
                  >
                    <Text style={{ color: createData.role === r ? '#000' : '#fff' }}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button title="Criar" onPress={handleCreateUser} buttonStyle={{ backgroundColor: '#00CF3A', marginTop: 12 }} />
              <Button title="Cancelar" onPress={() => setShowCreateModal(false)} type="outline" buttonStyle={{ marginTop: 8, borderColor: '#00CF3A' }} titleStyle={{ color: '#00CF3A' }} />
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
};
