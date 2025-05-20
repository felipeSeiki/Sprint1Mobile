import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Platform, Image } from 'react-native';
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
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{ backgroundColor: 'transparent' }}
        >
          <Image
            source={require('../../assets/MottuLogo.png')}
            style={styles.logo}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logOutButton}
          onPress={handleLogOut}
        >
          <Text style={styles.logOutText}>Sair</Text>
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
    marginLeft: -25, // Para alinhar melhor o logo
  },
  logOutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  logOutButton: {
    height: 30,
    width: 50,
    backgroundColor: '#00CF3A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

});

const Container = styled.View`
  flex: 1;
  background-color: #1A1A1A;
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
  background-color: #2A2A2A;
  border: 1px solid #00CF3A;
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
  color: #00CF3A;
`;

const SummaryLabel = styled.Text`
  font-size: 12px;
  color: #FFFFFF;
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
  color: #FFFFFF;
`;

const FilterButton = styled.TouchableOpacity`
  background-color: #2A2A2A;
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid #00CF3A;
`;

const FilterText = styled.Text`
  color: #FFFFFF;
`;

const AddButton = styled.TouchableOpacity`
  background-color: #00CF3A;
  padding: 10px 20px;
  border-radius: 20px;
`;

const AddButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

const MotoList = styled.View`
  flex: 1;
  background-color: #2A2A2A;
  border: 1px solid #00CF3A;
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
  border-bottom-color: #00CF3A;
  background-color: #1A1A1A;
`;

const HeaderText = styled.Text`
  font-weight: bold;
  color: #FFFFFF;
  flex: 1;
  text-align: center;
`;

const MotoItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #00CF3A;
`;

const MotoText = styled.Text`
  flex: 1;
  text-align: center;
  color: #FFFFFF;
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
  background-color: #2A2A2A;
  border-radius: 20px;
  padding: 20px;
  border: 2px solid #00CF3A;
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
  color: #00CF3A;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 5px;
`;

const CloseText = styled.Text`
  font-size: 18px;
  color: #00CF3A;
`;

const ModalBody = styled.View``;

const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const DetailLabel = styled.Text`
  font-weight: bold;
  color: #FFFFFF;
  opacity: 0.8;
`;

const DetailValue = styled.Text`
  color: #FFFFFF;
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