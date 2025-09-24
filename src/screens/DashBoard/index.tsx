import React, { useState, useEffect } from 'react';
import { Text, ScrollView, Modal, Image, TouchableOpacity } from 'react-native';
import { useDashBoard } from './hook/useDashBoard';
import { DashboardScreenProps } from './type/type';
import { ActionBar, AddButton, AddButtonText, CloseButton, CloseText, Container, Content, DetailLabel, DetailRow, DetailValue, FilterButton, FilterContainer, FilterLabel, FilterText, HeaderText, ListHeader, ModalBody, ModalContent, ModalHeader, ModalOverlay, ModalTitle, MotoItem, MotoList, MotoText, StatusBadge, StatusText, StatusValue, styles, SummaryCard, SummaryContainer, SummaryLabel, SummaryNumber } from './styles';
import { HeaderContainer } from '../../components/Header';
import { ListMoto } from './components/ListMoto';
import { SummaryMoto } from './components/SummaryMoto';
import { ModalMoto } from './components/ModalMoto';

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
            source={require('../../assets/MottuLogo.png')}
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