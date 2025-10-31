import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import theme from '../../styles/theme';
import ProtectedLayout from '../../components/ProtectedLayout';
import { patioService } from '../../services/patioService';
import { Patio } from '../../types/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${theme.colors.background};
`;

const Row = styled.View`
  flex-direction: row;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
  align-items: center;
`;

const Cell = styled.View`
  flex: 1;
`;

const Actions = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const ActionButton = styled.TouchableOpacity<{ color?: string }>`
  padding: 8px 10px;
  background-color: ${(props: { color: any; }) => props.color || theme.colors.primary};
  border-radius: 6px;
`;

const ActionText = styled.Text`
  color: white;
  font-weight: bold;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const AdminDashboardScreen: React.FC = () => {
  const [patios, setPatios] = useState<Patio[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const load = async () => {
    setLoading(true);
    try {
      const list = await patioService.getAllPatios();
      setPatios(list);
    } catch (e) {
      console.error('Erro ao carregar pátios:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirmDelete = (id: number) => {
    Alert.alert('Confirmar', 'Deseja realmente excluir este pátio?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => handleDelete(id) }
    ]);
  };

  const handleDelete = async (id: number) => {
    try {
      await patioService.deletePatioById(id);
      await load();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível excluir o pátio');
    }
  };

  const handleAddStaff = (patioId: number) => {
    // Navega para Register passando role e patioId para prefill
    navigation.navigate('Register' as any, { role: 'USER', patioId });
  };

  const handleAddAdmin = (patioId: number) => {
    navigation.navigate('Register' as any, { role: 'ADMIN', patioId });
  };

  const handleEdit = (patioId: number) => {
    navigation.navigate('RegisterPatio' as any, { patioId });
  };

  return (
    <ProtectedLayout>
      <Container>
        <Title>Pátios cadastrados</Title>

        <FlatList
          data={patios}
          keyExtractor={(item) => String(item.id)}
          refreshing={loading}
          onRefresh={load}
          ListEmptyComponent={<Text>Nenhum pátio encontrado</Text>}
          renderItem={({ item }) => (
            <Row>
              <Cell>
                <Text>ID: {String(item.id)}</Text>
              </Cell>
              <Cell>
                <Text>{item.endereco?.cidade} - {item.endereco?.estado}</Text>
              </Cell>
              <Actions>
                <ActionButton color="#e74c3c" onPress={() => confirmDelete(Number(item.id))}>
                  <ActionText>Excluir</ActionText>
                </ActionButton>
                <ActionButton color="#2980b9" onPress={() => handleAddStaff(Number(item.id))}>
                  <ActionText>Adicionar Funcionário</ActionText>
                </ActionButton>
                <ActionButton color="#27ae60" onPress={() => handleAddAdmin(Number(item.id))}>
                  <ActionText>Adicionar Admin</ActionText>
                </ActionButton>
                <ActionButton color="#f39c12" onPress={() => handleEdit(Number(item.id))}>
                  <ActionText>Editar</ActionText>
                </ActionButton>
              </Actions>
            </Row>
          )}
        />
      </Container>
    </ProtectedLayout>
  );
};

export default AdminDashboardScreen;
