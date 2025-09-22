import React, { useState, useEffect } from 'react';
import { Text, ScrollView, Modal, Image, TouchableOpacity } from 'react-native';
import { useDashBoard } from './hook/useDashBoard';
import { DashboardScreenProps } from './type/type';
import { ActionBar, AddButton, AddButtonText, CloseButton, CloseText, Container, Content, DetailLabel, DetailRow, DetailValue, FilterButton, FilterContainer, FilterLabel, FilterText, HeaderText, ListHeader, ModalBody, ModalContent, ModalHeader, ModalOverlay, ModalTitle, MotoItem, MotoList, MotoText, StatusBadge, StatusText, StatusValue, styles, SummaryCard, SummaryContainer, SummaryLabel, SummaryNumber } from './styles';
import { HeaderContainer } from '../../components/Header';

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


export default DashboardScreen;