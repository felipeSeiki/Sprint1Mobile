import React from 'react';
import { Text, Image, TouchableOpacity } from 'react-native';
import { useDashBoard } from './hook/useDashBoard';
import { DashboardScreenProps } from './type/type';
import { ListPatio } from './components/ListPatio';
import { ActionBar, AddButton, AddButtonText, Container, Content, FilterButton, FilterContainer, FilterLabel, FilterText, styles } from './styles';

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const {
    showModal,
    setShowModal,
    selectedPatio,
    patios,
    refreshing,
    onRefresh,
    handlePatioPress,
    deletePatio,
  } = useDashBoard();

  const handleAddPatio = () => {
    console.log('Navegando para RegisterPatio...');
    try {
      navigation.navigate('RegisterPatio', undefined);
    } catch (error) {
      console.error('Erro ao navegar:', error);
    }
  };

  return (
    <Container>
      <Content>

        <ActionBar>

          <AddButton onPress={handleAddPatio}>
            <AddButtonText>+ ADD PÁTIO</AddButtonText>
          </AddButton>
          <AddButton onPress={onRefresh}>
            <AddButtonText>↻ RESETAR LISTA</AddButtonText>
          </AddButton>
        </ActionBar>

        <ListPatio
          patios={patios}
          handlePatioPress={handlePatioPress}
          showModal={showModal}
          setShowModal={setShowModal}
          selectedPatio={selectedPatio ? selectedPatio.id : 0}
          deletePatio={deletePatio}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />

      </Content>

    </Container>
  );
};


export default DashboardScreen;