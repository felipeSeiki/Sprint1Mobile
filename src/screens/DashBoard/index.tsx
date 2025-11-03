import React, { useState } from 'react';
import { Text, Image, TouchableOpacity } from 'react-native';
import { useDashBoard } from './hook/useDashBoard';
import { DashboardScreenProps } from './type/type';
import { ListMoto } from './components/ListMoto';
import { SummaryMoto } from './components/SummaryMoto';
import { ModalMoto } from './components/ModalMoto';
import { ActionBar, AddButton, AddButtonText, Container, Content, FilterButton, FilterContainer, FilterLabel, FilterText, styles } from './styles';
import { FilterModal } from './components/FilterModal';

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const {
    user,
    showModal,
    setShowModal,
    selectedMoto,
    motos,
    handleMotoPress,
    handleLogOut,
    // filters
    patioOptions,
    statusOptions,
    filterPatioId,
    setFilterPatioId,
    filterStatus,
    setFilterStatus,
    filterPlate,
    setFilterPlate,
  } = useDashBoard();

  // Modal de filtros (aplicar de uma vez)
  const [showFilters, setShowFilters] = useState(false);
  const [draftPatioId, setDraftPatioId] = useState<typeof filterPatioId>(filterPatioId);
  const [draftStatus, setDraftStatus] = useState<string>(filterStatus);
  const [draftPlate, setDraftPlate] = useState<string>(filterPlate);

  const openFilters = () => {
    setDraftPatioId(filterPatioId);
    setDraftStatus(filterStatus);
    setDraftPlate(filterPlate);
    setShowFilters(true);
  };

  const applyFilters = () => {
    setFilterPatioId(draftPatioId);
    setFilterStatus(draftStatus);
    setFilterPlate(draftPlate);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setDraftPatioId('Todos');
    setDraftStatus('Todas');
    setDraftPlate('');
  };

  return (
    <Container>
      <Content>

        <SummaryMoto
          motos={motos}
        />

        <ActionBar>
          <FilterContainer>
            <FilterLabel>Filtros:</FilterLabel>
            <FilterButton onPress={openFilters}>
              <FilterText>Abrir</FilterText>
            </FilterButton>
          </FilterContainer>

          {user && (user.role !== 'MASTER') && (
            <AddButton onPress={() => navigation.navigate('RegisterMoto')}>
              <AddButtonText>+ ADD MOTO</AddButtonText>
            </AddButton>
          )}
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

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        patioOptions={patioOptions}
        statusOptions={statusOptions}
        draftPatioId={draftPatioId}
        setDraftPatioId={setDraftPatioId}
        draftStatus={draftStatus}
        setDraftStatus={setDraftStatus}
        draftPlate={draftPlate}
        setDraftPlate={setDraftPlate}
        onClear={clearFilters}
        onApply={applyFilters}
      />

    </Container>
  );
};


export default DashboardScreen;