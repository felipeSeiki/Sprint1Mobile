import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Moto } from '../types/motos';
import { useAuth } from '../contexts/AuthContext';
import { HeaderContainer } from '../components/Header';

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { signOut } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>('Todas');
  const [showModal, setShowModal] = useState(false);
  const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);

  // Dados mockados das motos
  const motos: Moto[] = [
    {
      id: '1',
      modelo: 'Honda CB 500',
      placa: 'ABC-1234',
      cod_tag: 'TAG001',
      status: 'Disponível',
      posicaoX: '0',
      posicaoY: '0',
    },
    {
      id: '2',
      modelo: 'Yamaha MT-07',
      placa: 'DEF-5678',
      cod_tag: 'TAG002',
      status: 'Manutenção',
      posicaoX: '2',
      posicaoY: '1',
    },
    {
      id: '3',
      modelo: 'Kawasaki Ninja 400',
      placa: 'GHI-9012',
      cod_tag: 'TAG003',
      status: 'Reservada',
      posicaoX: '8',
      posicaoY: '1',
    },
  ];

  const handleMotoPress = (moto: Moto) => {
    setSelectedMoto(moto);
    setShowModal(true);
  };

  const handleLogOut = () => {
    signOut();
    navigation.navigate('Login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível': return '#00CF3A';
      case 'Manutenção': return '#FF0000';
      case 'Reservada': return '#FFAA00';
      default: return '#2A2A2A';
    }
  };

  return (
    <Container>
      {/* Header */}
      <HeaderContainer>
        <Title>Dashboard de Motos</Title>
        <LogoutButton onPress={handleLogOut}>
          <LogoutText>Sair</LogoutText>
        </LogoutButton>
      </HeaderContainer>

      {/* Conteúdo principal */}
      <Content>
        {/* Cards de resumo */}
        <SummaryContainer>
          <SummaryCard>
            <SummaryNumber>{motos.length}</SummaryNumber>
            <SummaryLabel>Total de Motos</SummaryLabel>
          </SummaryCard>
          
          <SummaryCard>
            <SummaryNumber>{motos.filter(m => m.status === 'Disponível').length}</SummaryNumber>
            <SummaryLabel>Disponíveis</SummaryLabel>
          </SummaryCard>
          
          <SummaryCard>
            <SummaryNumber>{motos.filter(m => m.status === 'Manutenção').length}</SummaryNumber>
            <SummaryLabel>Em Manutenção</SummaryLabel>
          </SummaryCard>
        </SummaryContainer>

        {/* Filtro e botão de adicionar */}
        <ActionBar>
          <FilterContainer>
            <FilterLabel>Filtro:</FilterLabel>
            <FilterButton>
              <FilterText>{selectedFilter}</FilterText>
            </FilterButton>
          </FilterContainer>
          
          <AddButton onPress={() => navigation.navigate('RegisterMoto')}>
            <AddButtonText>+ ADD MOTO</AddButtonText>
          </AddButton>
        </ActionBar>

        {/* Lista de motos */}
        <MotoList>
          <ListHeader>
            <HeaderText>Modelo</HeaderText>
            <HeaderText>Placa</HeaderText>
            <HeaderText>Status</HeaderText>
          </ListHeader>
          
          <ScrollView>
            {motos.map(moto => (
              <MotoItem key={moto.id} onPress={() => handleMotoPress(moto)}>
                <MotoText>{moto.modelo}</MotoText>
                <MotoText>{moto.placa}</MotoText>
                <StatusBadge status={moto.status}>
                  <StatusText>{moto.status}</StatusText>
                </StatusBadge>
              </MotoItem>
            ))}
          </ScrollView>
        </MotoList>
      </Content>

      {/* Modal de detalhes da moto */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Detalhes da Moto</ModalTitle>
              <CloseButton onPress={() => setShowModal(false)}>
                <CloseText>✕</CloseText>
              </CloseButton>
            </ModalHeader>
            
            {selectedMoto && (
              <ModalBody>
                <DetailRow>
                  <DetailLabel>Modelo:</DetailLabel>
                  <DetailValue>{selectedMoto.modelo}</DetailValue>
                </DetailRow>
                
                <DetailRow>
                  <DetailLabel>Placa:</DetailLabel>
                  <DetailValue>{selectedMoto.placa}</DetailValue>
                </DetailRow>
                
                <DetailRow>
                  <DetailLabel>Tag:</DetailLabel>
                  <DetailValue>{selectedMoto.cod_tag}</DetailValue>
                </DetailRow>
                
                <DetailRow>
                  <DetailLabel>Status:</DetailLabel>
                  <StatusValue status={selectedMoto.status}>
                    {selectedMoto.status}
                  </StatusValue>
                </DetailRow>
              </ModalBody>
            )}
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
};

// Estilização com styled-components
const Container = styled.View`
  flex: 1;
  background-color: #F5F7FA;
`;

const Header = styled.View`
  background-color: #1A365D;
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

const LogoutButton = styled.TouchableOpacity`
  padding: 8px 12px;
  background-color: #2C5282;
  border-radius: 4px;
`;

const LogoutText = styled.Text`
  color: white;
`;

const Content = styled.View`
  flex: 1;
  padding: 20px;
`;

const SummaryContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const SummaryCard = styled.View`
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  width: 30%;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const SummaryNumber = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #1A365D;
`;

const SummaryLabel = styled.Text`
  font-size: 12px;
  color: #718096;
  margin-top: 5px;
`;

const ActionBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const FilterContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FilterLabel = styled.Text`
  margin-right: 10px;
  color: #4A5568;
`;

const FilterButton = styled.TouchableOpacity`
  background-color: white;
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
`;

const FilterText = styled.Text`
  color: #1A365D;
`;

const AddButton = styled.TouchableOpacity`
  background-color: #4299E1;
  padding: 10px 20px;
  border-radius: 20px;
`;

const AddButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

const MotoList = styled.View`
  flex: 1;
  background-color: white;
  border-radius: 8px;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const ListHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #E2E8F0;
  background-color: #F7FAFC;
`;

const HeaderText = styled.Text`
  font-weight: bold;
  color: #4A5568;
  flex: 1;
  text-align: center;
`;

const MotoItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #E2E8F0;
`;

const MotoText = styled.Text`
  flex: 1;
  text-align: center;
  color: #2D3748;
`;

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = styled.View<StatusBadgeProps>`
  background-color: ${(props: StatusBadgeProps) => getStatusColor(props.status)};
  padding: 5px 10px;
  border-radius: 12px;
  flex: 1;
  align-items: center;
`;

const StatusText = styled.Text`
  color: white;
  font-size: 12px;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  width: 80%;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1A365D;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 5px;
`;

const CloseText = styled.Text`
  font-size: 18px;
  color: #718096;
`;

const ModalBody = styled.View``;

const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const DetailLabel = styled.Text`
  font-weight: bold;
  color: #4A5568;
`;

const DetailValue = styled.Text`
  color: #2D3748;
`;

const StatusValue = styled.Text<{ status: string }>`
  color: ${(props: { status: string; }) => getStatusColor(props.status)};
  font-weight: bold;
`;

// Função auxiliar para cores de status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Disponível': return '#00CF3A';
    case 'Manutenção': return '#FF0000';
    case 'Reservada': return '#FFAA00';
    default: return '#2A2A2A';
  }
};

export default DashboardScreen;