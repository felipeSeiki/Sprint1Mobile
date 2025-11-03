import React from 'react';
import { Modal, View } from 'react-native';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  CloseText,
  ModalBody,
  FilterContainer,
  FilterLabel,
  FilterButton,
  FilterText,
  SearchInput,
  AddButton,
  AddButtonText,
} from '../styles';

export type PatioOptionId = string | number; // 'Todos' and city-group ids like CITY|cidade|estado

export interface PatioOption {
  id: PatioOptionId;
  label: string;
}

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  patioOptions: PatioOption[];
  statusOptions: string[];
  draftPatioId: PatioOptionId;
  setDraftPatioId: React.Dispatch<React.SetStateAction<PatioOptionId>>;
  draftStatus: string;
  setDraftStatus: React.Dispatch<React.SetStateAction<string>>;
  draftPlate: string;
  setDraftPlate: React.Dispatch<React.SetStateAction<string>>;
  onClear: () => void;
  onApply: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  patioOptions,
  statusOptions,
  draftPatioId,
  setDraftPatioId,
  draftStatus,
  setDraftStatus,
  draftPlate,
  setDraftPlate,
  onClear,
  onApply,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Filtros</ModalTitle>
            <CloseButton onPress={onClose}>
              <CloseText>✕</CloseText>
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            <FilterContainer style={{ marginBottom: 12 }}>
              <FilterLabel>Pátio:</FilterLabel>
              <FilterButton
                onPress={() => {
                  const idx = patioOptions.findIndex((p) => p.id === draftPatioId);
                  const next = patioOptions[(idx + 1) % patioOptions.length];
                  setDraftPatioId(next.id);
                }}
              >
                <FilterText>
                  {patioOptions.find((p) => p.id === draftPatioId)?.label || 'Todos os pátios'}
                </FilterText>
              </FilterButton>
            </FilterContainer>

            <FilterContainer style={{ marginBottom: 12 }}>
              <FilterLabel>Status:</FilterLabel>
              <FilterButton
                onPress={() => {
                  const idx = statusOptions.findIndex((s) => s === draftStatus);
                  const next = statusOptions[(idx + 1) % statusOptions.length];
                  setDraftStatus(next);
                }}
              >
                <FilterText>{draftStatus}</FilterText>
              </FilterButton>
            </FilterContainer>

            <FilterContainer style={{ marginBottom: 12 }}>
              <FilterLabel>Placa:</FilterLabel>
              <SearchInput
                placeholder="Buscar placa"
                placeholderTextColor="#aaa"
                value={draftPlate}
                onChangeText={setDraftPlate}
              />
            </FilterContainer>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              <FilterButton onPress={onClear}>
                <FilterText>Limpar</FilterText>
              </FilterButton>
              <AddButton onPress={onApply}>
                <AddButtonText>Aplicar</AddButtonText>
              </AddButton>
            </View>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
