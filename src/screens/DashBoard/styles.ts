import styled from "styled-components/native";
import { StatusBadgeProps } from "./interface/interfaces";
import { Platform, StyleSheet } from "react-native";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Disponível":
      return "#00CF3A";
    case "Manutenção":
      return "#FF0000";
    case "Reservada":
      return "#FFAA00";
    default:
      return "#2A2A2A";
  }
};

export const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
    marginLeft: -25, // Para alinhar melhor o logo
  },
  logOutText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  logOutButton: {
    height: 30,
    width: 50,
    backgroundColor: "#00CF3A",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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

export const Container = styled.View`
  flex: 1;
  background-color: #1a1a1a;
`;

export const Header = styled.View`
  background-color: #1a365d;
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

export const LogoutButton = styled.TouchableOpacity`
  padding: 8px 12px;
  background-color: #2c5282;
  border-radius: 4px;
`;

export const LogoutText = styled.Text`
  color: white;
`;

export const Content = styled.View`
  flex: 1;
  padding: 20px;
`;

export const SummaryContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const SummaryCard = styled.View`
  background-color: #2a2a2a;
  border: 1px solid #00cf3a;
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

export const SummaryNumber = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #00cf3a;
`;

export const SummaryLabel = styled.Text`
  font-size: 12px;
  color: #ffffff;
  margin-top: 5px;
`;

export const ActionBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`;

export const FilterContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const FilterLabel = styled.Text`
  margin-right: 10px;
  color: #ffffff;
`;

export const FilterButton = styled.TouchableOpacity`
  background-color: #2a2a2a;
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid #00cf3a;
`;

export const FilterText = styled.Text`
  color: #ffffff;
`;

export const SearchInput = styled.TextInput`
  min-width: 130px;
  padding: 10px 12px;
  background-color: #2a2a2a;
  border: 1px solid #00cf3a;
  border-radius: 8px;
  color: #ffffff;
`;

export const AddButton = styled.TouchableOpacity`
  background-color: #00cf3a;
  padding: 10px 20px;
  border-radius: 20px;
`;

export const AddButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

export const MotoList = styled.View`
  flex: 1;
  background-color: #2a2a2a;
  border: 1px solid #00cf3a;
  border-radius: 8px;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

export const ListHeader = styled.View`
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
  flex: 1;
  text-align: center;
`;

export const MotoItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #00cf3a;
`;

export const MotoText = styled.Text`
  flex: 1;
  text-align: center;
  color: #ffffff;
`;

export const StatusBadge = styled.View<StatusBadgeProps>`
  background-color: ${(props: StatusBadgeProps) =>
    getStatusColor(props.status)};
  padding: 5px 10px;
  border-radius: 12px;
  flex: 1;
  align-items: center;
`;

export const StatusText = styled.Text`
  color: white;
  font-size: 12px;
`;

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  width: 80%;
  background-color: #2a2a2a;
  border-radius: 20px;
  padding: 20px;
  border: 2px solid #00cf3a;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #00cf3a;
`;

export const CloseButton = styled.TouchableOpacity`
  padding: 5px;
`;

export const CloseText = styled.Text`
  font-size: 18px;
  color: #00cf3a;
`;

export const ModalBody = styled.View``;

export const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`;

export const DetailLabel = styled.Text`
  font-weight: bold;
  color: #ffffff;
  opacity: 0.8;
`;

export const DetailValue = styled.Text`
  color: #ffffff;
`;

export const StatusValue = styled.Text<{ status: string }>`
  color: ${(props: { status: string }) => getStatusColor(props.status)};
  font-weight: bold;
`;
