import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #1a1a1a;
`;

export const Content = styled.View`
  flex: 1;
  padding: 20px;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #00CF3A;
  margin-bottom: 20px;
`;

export const TableContainer = styled.View`
  flex: 1;
  background-color: #2a2a2a;
  border: 1px solid #00cf3a;
  border-radius: 8px;
`;

export const TableHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #00cf3a;
  background-color: #1a1a1a;
`;

export const HeaderText = styled.Text`
  font-weight: bold;
  color: #ffffff;
  text-align: center;
`;

export const TableRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #00cf3a;
  align-items: center;
`;

export const RowText = styled.Text`
  color: #ffffff;
  text-align: center;
`;

export const ActionButton = styled.TouchableOpacity`
  background-color: #00cf3a;
  padding: 8px 12px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

export const ActionButtonText = styled.Text`
  color: #ffffff;
  font-weight: bold;
  font-size: 14px;
`;

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  width: 85%;
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  border: 2px solid #00cf3a;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #00cf3a;
`;

export const CloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const CloseText = styled.Text`
  font-size: 24px;
  color: #00cf3a;
  font-weight: bold;
`;

export const ModalBody = styled.View`
  margin-top: 12px;
`;
