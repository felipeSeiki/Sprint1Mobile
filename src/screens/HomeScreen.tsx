import React, { useState, useEffect, useRef } from 'react';
import { Text, Modal, PanResponder, Animated, GestureResponderEvent, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import { RootStackParamList } from '../types/navigation';
import { Moto } from '../types/motos';
import theme from '../styles/theme';
import { HeaderContainer } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

interface StatusProps {
  status: string;
}

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

// Posições disponíveis no pátio
const parkingSpots = {
  top: { x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], y: 0 },
  middle: { x: [0, 1, 2, 3, 4, 8, 9, 10, 11, 12], y: 1 },
  bottom: { x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], y: 2 }
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const [motos, setMotos] = useState<Moto[]>([]);
  const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { signOut } = useAuth();

  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const lastScale = useRef(1);
  const initialPanValue = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const panListener = pan.addListener(value => {
      initialPanValue.current = value;
    });
    
    return () => {
      pan.removeListener(panListener);
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        pan.extractOffset();
      },

      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ],
        { useNativeDriver: false }
      ),

      onPanResponderRelease: () => {
        // Simply flatten the offset to keep the view where it was released
        pan.flattenOffset();
      }
    })
  ).current;

  // Mock de motos para teste
  const mockMotos: Moto[] = [
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
      status: 'Estacionada',
      posicaoX: '8',
      posicaoY: '1',
    },
  ];

  useEffect(() => {
    setMotos(mockMotos);
  }, []);

  const handleMotoPress = (moto: Moto) => {
    setSelectedMoto(moto);
    setShowModal(true);
  };

  
  const handleLogOut = () => {
    signOut();
    navigation.navigate('Login')
  };

  const getSpotColor = (moto: Moto | undefined) => {
    if (!moto) return '#2A2A2A';
    switch (moto.status) {
      case 'Disponível':
        return '#00CF3A';
      case 'Manutenção':
        return '#FF0000';
      default:
        return '#FFAA00';
    }
  };

  const renderMotoSpot = (x: number, y: number) => {
    const moto = motos.find(m => m.posicaoX === x.toString() && m.posicaoY === y.toString());
    return (
      <BikeSpot
        key={`${x}-${y}`}
        color={getSpotColor(moto)}
        onPress={() => moto && handleMotoPress(moto)}
      >
        <BikeIcon>🏍</BikeIcon>
      </BikeSpot>
    );
  };

  return (
    <Container>
       <HeaderContainer>
        <TouchableOpacity
          style={styles.logOutButton}
          onPress={handleLogOut}
        >
          <Text>Sair</Text>
        </TouchableOpacity>
      </HeaderContainer>

      <CardContainer>
        <AnimatedCardContainer
          {...panResponder.panHandlers}
          style={{
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { scale: scale }
            ]
          }}
        >
          <Card>
            {/* Topo do pátio */}
            <Row>
              {parkingSpots.top.x.map(x => renderMotoSpot(x, parkingSpots.top.y))}
            </Row>

            {/* Centro do pátio */}
            <Row style={{ justifyContent: 'space-between', marginVertical: 30 }}>
              <Column style={{ width: '30%' }}>
                {[0, 1, 2].map(x => renderMotoSpot(x, parkingSpots.middle.y))}
              </Column>
              <EmptySpace />
              <Column style={{ width: '30%' }}>
                {[8, 9, 10].map(x => renderMotoSpot(x, parkingSpots.middle.y))}
              </Column>
            </Row>

            {/* Base do pátio */}
            <Row>
              {parkingSpots.bottom.x.map(x => renderMotoSpot(x, parkingSpots.bottom.y))}
            </Row>
          </Card>
        </AnimatedCardContainer>
      </CardContainer>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Informações da Moto</ModalTitle>
              <CloseButton onPress={() => setShowModal(false)}>
                <CloseButtonText>✕</CloseButtonText>
              </CloseButton>
            </ModalHeader>

            {selectedMoto && (
              <ModalBody>
                <InfoRow>
                  <InfoLabel>Modelo:</InfoLabel>
                  <InfoText>{selectedMoto.modelo}</InfoText>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Placa:</InfoLabel>
                  <InfoText>{selectedMoto.placa}</InfoText>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Tag:</InfoLabel>
                  <InfoText>{selectedMoto.cod_tag}</InfoText>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Status:</InfoLabel>
                  <StatusText status={selectedMoto.status}>{selectedMoto.status}</StatusText>
                </InfoRow>
              </ModalBody>
            )}
          </ModalContent>
        </ModalOverlay>
      </Modal>

      <BottomContainer>
        <FilterDropdown>
          <Text>Filtro:</Text>
          <Picker value={selectedFilter} />
        </FilterDropdown>
        <AddButton onPress={() => navigation.navigate('RegisterMoto')}>
          <AddButtonText>+ ADD MOTO</AddButtonText>
        </AddButton>
      </BottomContainer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #1A1A1A;
  width: 100%;
`;

const CardContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  overflow: hidden;
`;

const AnimatedCardContainer = styled(Animated.View)`
  width: 95%;
  max-width: 500px;
  background-color: #2A2A2A;
  border-radius: 20px;
  border: 2px solid #00CF3A;
  
  @media (min-width: 600px) {
    max-width: 700px;
  }
`;

const Card = styled.View`
  min-height: 500px;
  padding: 20px;
  justify-content: space-between;

  @media (min-width: 600px) {
    min-height: 700px;
    padding: 30px;
  }
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 15px 0;
  flex-wrap: wrap;
`;

const Column = styled.View`
  align-items: center;
  justify-content: space-between;
  gap: 15px;
`;

const BikeSpot = styled.TouchableOpacity<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props: { color: string }) => props.color};
  justify-content: center;
  align-items: center;
  margin: 5px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const BikeIcon = styled.Text`
  font-size: 18px;
`;

const EmptySpace = styled.View`
  width: 35%;
  min-width: 80px;
`;

const BottomContainer = styled.View`
  width: 100%;
  padding: 15px 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FilterDropdown = styled.View`
  flex: 1;
  max-width: 200px;
  flex-direction: row;
  align-items: center;
  background-color: #2A2A2A;
  border-radius: 8px;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #00CF3A;
`;

const Picker = styled.View`
  flex: 1;
  margin-left: 10px;
`;

const AddButton = styled.TouchableOpacity`
  background-color: #00CF3A;
  padding: 12px 24px;
  border-radius: 25px;
`;

const AddButtonText = styled.Text`
  color: #FFFFFF;
  font-weight: bold;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  width: 300px;
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
  border-bottom-width: 1px;
  border-bottom-color: #00CF3A;
  padding-bottom: 10px;
`;

const ModalTitle = styled.Text`
  color: #00CF3A;
  font-size: 18px;
  font-weight: bold;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 5px;
`;

const CloseButtonText = styled.Text`
  color: #00CF3A;
  font-size: 20px;
`;

const ModalBody = styled.View`
  gap: 10px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.Text`
  color: #FFFFFF;
  opacity: 0.8;
`;

const InfoText = styled.Text`
  color: #FFFFFF;
`;

const StatusText = styled.Text<StatusProps>`
  color: ${(props: StatusProps) => {
    switch (props.status) {
      case 'Disponível':
        return '#00CF3A';
      case 'Manutenção':
        return '#FF0000';
      default:
        return '#FFAA00';
    }
  }};
  font-weight: bold;
`;


const styles = StyleSheet.create({
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
  }
});
export default HomeScreen;