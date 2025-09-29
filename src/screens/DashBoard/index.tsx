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
      <HeaderContainer>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{ backgroundColor: 'transparent' }}
        >
          <Image
            source={require('../../../assets/MottuLogo.png')}
            style={styles.logo}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logOutButton}
          onPress={() => handleLogOut(navigation)}
        >
          <Text style={styles.logOutText}>Sair</Text>
        </TouchableOpacity>
      </HeaderContainer>

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