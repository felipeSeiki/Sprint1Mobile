import { StyleSheet, Platform, Animated } from 'react-native';
import styled from 'styled-components/native';

interface StatusProps {
  status: string;
}

export const Container = styled.View`
  flex: 1;
  background-color: #1A1A1A;
  width: 100%;
`;

export const CardContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
`;

export const AnimatedCardContainer = styled(Animated.View)`
  width: 95%;
  max-width: 500px;
  background-color: #2A2A2A;
  border-radius: 20px;
  border: 2px solid #00CF3A;
  overflow: visible;
  
  @media (min-width: 600px) {
    max-width: 700px;
  }
`;

export const Card = styled.View`
  min-height: 500px;
  padding: 20px;
  justify-content: space-between;

  @media (min-width: 600px) {
    min-height: 700px;
    padding: 30px;
  }
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 15px 0;
  flex-wrap: wrap;
`;

export const Column = styled.View`
  align-items: center;
  justify-content: space-between;
  gap: 15px;
`;

export const BikeSpot = styled.TouchableOpacity<{ color: string }>`
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

export const BikeIcon = styled.Text`
  font-size: 18px;
`;

export const EmptySpace = styled.View`
  width: 35%;
  min-width: 80px;
`;

export const BottomContainer = styled.View`
  width: 100%;
  padding: 15px 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const FilterDropdown = styled.View`
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



export const AddButton = styled.TouchableOpacity`
  background-color: #00CF3A;
  padding: 12px 24px;
  border-radius: 25px;
`;

export const AddButtonText = styled.Text`
  color: #FFFFFF;
  font-weight: bold;
`;

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  width: 300px;
  background-color: #2A2A2A;
  border-radius: 20px;
  padding: 20px;
  border: 2px solid #00CF3A;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #00CF3A;
  padding-bottom: 10px;
`;

export const ModalTitle = styled.Text`
  color: #00CF3A;
  font-size: 18px;
  font-weight: bold;
`;

export const CloseButton = styled.TouchableOpacity`
  padding: 5px;
`;

export const CloseButtonText = styled.Text`
  color: #00CF3A;
  font-size: 20px;
`;

export const ModalBody = styled.View`
  gap: 10px;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const InfoLabel = styled.Text`
  color: #FFFFFF;
  opacity: 0.8;
`;

export const InfoText = styled.Text`
  color: #FFFFFF;
`;

export const StatusText = styled.Text<StatusProps>`
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


export const styles = StyleSheet.create({
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