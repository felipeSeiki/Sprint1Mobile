import React from 'react';
import { Text, Image, TouchableOpacity } from 'react-native';
import { useDashBoard } from './hook/useDashBoard';
import { DashboardScreenProps } from './type/type';
import { HeaderContainer } from '../../components/Header';
import { ListMoto } from './components/ListMoto';
import { SummaryMoto } from './components/SummaryMoto';
import { ModalMoto } from './components/ModalMoto';
import { ActionBar, AddButton, AddButtonText, Container, Content, FilterButton, FilterContainer, FilterLabel, FilterText, styles } from './styles';

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const {
    selectedFilter,
    showModal,
    setShowModal,
    selectedMoto,
    motos,
    handleMotoPress,
    handleLogOut,
  } = useDashBoard();

  return (
    <Container>
      <Content>

        <SummaryMoto
          motos={motos}
        />

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

        <ListMoto
          motos={motos}
          handleMotoPress={handleMotoPress}
        />

      </Content>

      <ModalMoto
        showModal={showModal}
        setShowModal={setShowModal}
        selectedMoto={selectedMoto}
      />

    </Container>
  );
};


export default DashboardScreen;